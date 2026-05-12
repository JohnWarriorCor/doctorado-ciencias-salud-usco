import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FirestoreService } from '../../../core/services/firestore.service';
import { GrupoInvestigacion } from '../../../core/models';

@Component({
  selector: 'app-admin-investigacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, Button, Dialog, InputText, ConfirmDialog, Toast],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="admin-hero"><h1><i class="fas fa-microscope"></i> Gestión de Grupos de Investigación</h1></div>
    <div class="admin-container">
      <div class="toolbar">
        <a routerLink="/admin" class="btn-back"><i class="fas fa-arrow-left"></i> Volver</a>
        <p-button label="Nuevo Grupo" icon="fas fa-plus" (onClick)="openNew()" />
      </div>

      <!-- Search bar -->
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input pInputText [(ngModel)]="searchTerm" placeholder="Buscar por Nombre del Grupo o Líder" (input)="filterGroups()" class="search-input"/>
      </div>

      <p-table [value]="filteredItems()" [paginator]="true" [rows]="10" styleClass="p-datatable-sm p-datatable-striped">
        <ng-template #header>
          <tr>
            <th style="width:50px">N°</th>
            <th>Código de Grupo Colciencias</th>
            <th>Nombre del Grupo</th>
            <th>Líder del Grupo</th>
            <th>Clasificación</th>
            <th>GrupLAC</th>
            <th style="width:140px">Acciones</th>
          </tr>
        </ng-template>
        <ng-template #body let-item let-i="rowIndex">
          <tr>
            <td style="text-align:center;font-weight:600">{{i + 1}}</td>
            <td><code class="code-badge">{{item.codigoColciencias}}</code></td>
            <td><strong>{{item.nombreGrupo}}</strong></td>
            <td>{{item.liderGrupo}}</td>
            <td><span class="clasif-badge" [class]="'clasif-' + (item.clasificacion || '').replace(' ','')">{{item.clasificacion}}</span></td>
            <td>
              @if(item.grupLAC) {
                <a [href]="item.grupLAC" target="_blank" class="link-gruplac"><i class="fas fa-external-link-alt"></i></a>
              }
            </td>
            <td>
              <p-button icon="fas fa-pen" [rounded]="true" [text]="true" severity="info" (onClick)="editItem(item)"/>
              <p-button icon="fas fa-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(item)"/>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage><tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--surface-400)"><i class="fas fa-microscope" style="font-size:1.5rem;display:block;margin-bottom:.5rem"></i>No hay grupos de investigación registrados</td></tr></ng-template>
      </p-table>

      <p-dialog [(visible)]="dialogVisible" [header]="isEdit ? 'Editar Grupo de Investigación' : 'Nuevo Grupo de Investigación'" [modal]="true" [style]="{width:'620px'}" [draggable]="false">
        <div class="form-grid">
          <div class="form-row">
            <div class="form-group">
              <label>Código Colciencias *</label>
              <input pInputText [(ngModel)]="form.codigoColciencias" placeholder="Ej: COL001991" class="w-full"/>
            </div>
            <div class="form-group">
              <label>Clasificación *</label>
              <input pInputText [(ngModel)]="form.clasificacion" placeholder="Ej: A1, A, B, C" class="w-full"/>
            </div>
          </div>
          <div class="form-group">
            <label>Nombre del Grupo *</label>
            <input pInputText [(ngModel)]="form.nombreGrupo" placeholder="Nombre del grupo de investigación" class="w-full"/>
          </div>
          <div class="form-group">
            <label>Líder del Grupo *</label>
            <input pInputText [(ngModel)]="form.liderGrupo" placeholder="Nombre completo del líder" class="w-full"/>
          </div>
          <div class="form-group">
            <label>URL GrupLAC</label>
            <input pInputText [(ngModel)]="form.grupLAC" placeholder="https://scienti.colciencias.gov.co/..." class="w-full"/>
          </div>
        </div>
        <ng-template #footer>
          <p-button label="Cancelar" icon="fas fa-times" [text]="true" (onClick)="dialogVisible=false"/>
          <p-button label="Guardar" icon="fas fa-save" (onClick)="save()" [loading]="saving()"/>
        </ng-template>
      </p-dialog>
      <p-confirmDialog/><p-toast/>
    </div>
  `,
  styles: `
    .admin-hero{background:linear-gradient(135deg,#1e262b,#6a1b9a);padding:3.5rem 2rem 2rem;text-align:center}
    .admin-hero h1{color:white;font-size:1.6rem;display:flex;align-items:center;justify-content:center;gap:.6rem}
    .admin-container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem}
    .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem}
    .btn-back{display:inline-flex;align-items:center;gap:.4rem;color:var(--usco-vinotinto);font-weight:600;font-size:.9rem}

    .search-bar{display:flex;align-items:center;gap:.6rem;background:var(--surface-50);border:1px solid var(--surface-200);border-radius:8px;padding:.6rem 1rem;margin-bottom:1.5rem}
    .search-bar i{color:var(--surface-400);font-size:.9rem}
    .search-input{border:none;background:transparent;outline:none;width:100%;font-size:.9rem;color:var(--surface-700)}

    .code-badge{background:var(--surface-100);color:var(--usco-vinotinto);padding:.2rem .6rem;border-radius:4px;font-size:.82rem;font-weight:600}
    .clasif-badge{display:inline-block;padding:.2rem .7rem;border-radius:12px;font-size:.8rem;font-weight:700;background:var(--surface-100);color:var(--surface-700)}
    .clasif-A1{background:#e8f5e9;color:#2e7d32}.clasif-A{background:#e3f2fd;color:#1565c0}.clasif-B{background:#fff3e0;color:#e65100}.clasif-C{background:#fce4ec;color:#c62828}

    .link-gruplac{color:var(--usco-vinotinto);font-size:1.1rem;transition:color .2s}
    .link-gruplac:hover{color:#5c0e12}

    .form-grid{display:flex;flex-direction:column;gap:1rem}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .form-group{display:flex;flex-direction:column;gap:.35rem}
    .form-group label{font-size:.85rem;font-weight:600;color:var(--surface-600)}
    .w-full{width:100%}
  `,
})
export class AdminInvestigacionComponent implements OnInit {
  private fs = inject(FirestoreService);
  private confirm = inject(ConfirmationService);
  private msg = inject(MessageService);

  items = signal<GrupoInvestigacion[]>([]);
  filteredItems = signal<GrupoInvestigacion[]>([]);
  dialogVisible = false;
  isEdit = false;
  saving = signal(false);
  searchTerm = '';
  form: GrupoInvestigacion = this.emptyForm();

  ngOnInit() {
    this.fs.getCollection<GrupoInvestigacion>('gruposInvestigacion').subscribe(d => {
      this.items.set(d || []);
      this.filterGroups();
    });
  }

  emptyForm(): GrupoInvestigacion {
    return { codigoColciencias: '', nombreGrupo: '', liderGrupo: '', clasificacion: '', grupLAC: '' };
  }

  openNew() {
    this.form = this.emptyForm();
    this.isEdit = false;
    this.dialogVisible = true;
  }

  editItem(item: GrupoInvestigacion) {
    this.form = { ...item };
    this.isEdit = true;
    this.dialogVisible = true;
  }

  filterGroups() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredItems.set(this.items());
      return;
    }
    this.filteredItems.set(
      this.items().filter(g =>
        (g.nombreGrupo || '').toLowerCase().includes(term) ||
        (g.liderGrupo || '').toLowerCase().includes(term) ||
        (g.codigoColciencias || '').toLowerCase().includes(term)
      )
    );
  }

  async save() {
    if (!this.form.codigoColciencias || !this.form.nombreGrupo || !this.form.liderGrupo || !this.form.clasificacion) {
      this.msg.add({ severity: 'warn', summary: 'Atención', detail: 'Los campos con (*) son obligatorios' });
      return;
    }
    this.saving.set(true);
    try {
      const data: any = {
        codigoColciencias: this.form.codigoColciencias,
        nombreGrupo: this.form.nombreGrupo,
        liderGrupo: this.form.liderGrupo,
        clasificacion: this.form.clasificacion,
        grupLAC: this.form.grupLAC || '',
      };
      if (this.isEdit && this.form.key) {
        await this.fs.updateDocument('gruposInvestigacion', this.form.key, data);
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado correctamente' });
      } else {
        await this.fs.addDocument('gruposInvestigacion', data);
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo creado correctamente' });
      }
      this.dialogVisible = false;
    } catch (err: any) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: err.message });
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(item: GrupoInvestigacion) {
    this.confirm.confirm({
      message: `¿Eliminar el grupo "${item.nombreGrupo}"?`,
      header: 'Confirmar eliminación',
      icon: 'fas fa-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No',
      accept: async () => {
        try {
          await this.fs.deleteDocument('gruposInvestigacion', item.key!);
          this.msg.add({ severity: 'success', summary: 'Eliminado', detail: 'Grupo eliminado correctamente' });
        } catch (err: any) {
          this.msg.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      },
    });
  }
}
