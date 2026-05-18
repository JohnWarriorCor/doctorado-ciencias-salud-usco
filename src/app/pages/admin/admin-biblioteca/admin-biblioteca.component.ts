import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FirestoreService } from '../../../core/services/firestore.service';

export interface LibroItem {
  titulo: string;
  autor: string;
  editorial: string;
  ejemplares: number;
  anio?: string;
  isbn?: string;
  descripcion?: string;
  key?: string;
}

@Component({
  selector: 'app-admin-biblioteca',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, Button, Dialog, InputText, Textarea, InputNumber, ConfirmDialog, Toast],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="admin-hero"><h1><i class="fas fa-book"></i> Gestión de Biblioteca</h1></div>
    <div class="admin-container">
      <div class="toolbar">
        <a routerLink="/admin" class="btn-back"><i class="fas fa-arrow-left"></i> Volver</a>
        <p-button label="Nuevo Libro" icon="fas fa-plus" (onClick)="openNew()" />
      </div>

      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input pInputText [(ngModel)]="searchTerm" placeholder="Buscar por título, autor o editorial..." (input)="filterItems()" class="search-input"/>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="stats-row">
        <div class="stat-card">
          <i class="fas fa-books"></i>
          <div>
            <span class="stat-num">{{items().length}}</span>
            <span class="stat-lbl">Títulos registrados</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-copy"></i>
          <div>
            <span class="stat-num">{{totalEjemplares()}}</span>
            <span class="stat-lbl">Ejemplares totales</span>
          </div>
        </div>
      </div>

      <p-table [value]="filteredItems()" [paginator]="true" [rows]="10" styleClass="p-datatable-sm p-datatable-striped">
        <ng-template #header>
          <tr>
            <th style="width:50px">N°</th>
            <th pSortableColumn="titulo">Título <p-sortIcon field="titulo"/></th>
            <th pSortableColumn="autor">Autor <p-sortIcon field="autor"/></th>
            <th>Editorial</th>
            <th style="width:100px;text-align:center">Ejemplares</th>
            <th style="width:80px">Año</th>
            <th style="width:140px">Acciones</th>
          </tr>
        </ng-template>
        <ng-template #body let-item let-i="rowIndex">
          <tr>
            <td style="text-align:center;font-weight:600;color:var(--usco-vinotinto)">{{i + 1}}</td>
            <td><strong>{{item.titulo}}</strong>
              @if(item.isbn){<div class="isbn-badge">ISBN: {{item.isbn}}</div>}
            </td>
            <td>{{item.autor}}</td>
            <td style="font-size:.88rem;color:var(--surface-600)">{{item.editorial}}</td>
            <td style="text-align:center">
              <span class="ejemplares-badge">{{item.ejemplares}}</span>
            </td>
            <td style="font-size:.88rem">{{item.anio || '—'}}</td>
            <td>
              <p-button icon="fas fa-pen" [rounded]="true" [text]="true" severity="info" (onClick)="editItem(item)"/>
              <p-button icon="fas fa-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(item)"/>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="7" style="text-align:center;padding:3rem;color:var(--surface-400)">
              <i class="fas fa-book-open" style="font-size:2rem;display:block;margin-bottom:.75rem"></i>
              No hay libros registrados en la biblioteca
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Diálogo crear/editar -->
      <p-dialog [(visible)]="dialogVisible" [header]="isEdit ? 'Editar Libro' : 'Nuevo Libro'" [modal]="true" [style]="{width:'640px'}" [draggable]="false">
        <div class="form-grid">
          <div class="form-group">
            <label>Título *</label>
            <input pInputText [(ngModel)]="form.titulo" placeholder="Título completo del libro" class="w-full"/>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Autor(es) *</label>
              <input pInputText [(ngModel)]="form.autor" placeholder="Nombre del autor" class="w-full"/>
            </div>
            <div class="form-group">
              <label>Editorial *</label>
              <input pInputText [(ngModel)]="form.editorial" placeholder="Editorial o publicadora" class="w-full"/>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Ejemplares *</label>
              <p-inputNumber [(ngModel)]="form.ejemplares" [min]="1" [max]="999" placeholder="1" class="w-full"/>
            </div>
            <div class="form-group">
              <label>Año de publicación</label>
              <input pInputText [(ngModel)]="form.anio" placeholder="Ej: 2023" class="w-full"/>
            </div>
          </div>
          <div class="form-group">
            <label>ISBN</label>
            <input pInputText [(ngModel)]="form.isbn" placeholder="Ej: 978-3-16-148410-0" class="w-full"/>
          </div>
          <div class="form-group">
            <label>Descripción / Resumen</label>
            <textarea pTextarea [(ngModel)]="form.descripcion" rows="3" placeholder="Breve descripción del libro..." class="w-full"></textarea>
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
    .admin-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:3.5rem 2rem 2rem;text-align:center}
    .admin-hero h1{color:white;font-size:1.6rem;display:flex;align-items:center;justify-content:center;gap:.6rem}
    .admin-container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem}
    .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem}
    .btn-back{display:inline-flex;align-items:center;gap:.4rem;color:var(--usco-vinotinto);font-weight:600;font-size:.9rem;text-decoration:none;transition:opacity .2s}
    .btn-back:hover{opacity:.75}

    .search-bar{display:flex;align-items:center;gap:.6rem;background:var(--surface-50);border:1px solid var(--surface-200);border-radius:8px;padding:.6rem 1rem;margin-bottom:1.5rem}
    .search-bar i{color:var(--surface-400);font-size:.9rem}
    .search-input{border:none;background:transparent;outline:none;width:100%;font-size:.9rem;color:var(--surface-700)}

    .stats-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem}
    .stat-card{display:flex;align-items:center;gap:1rem;background:var(--surface-50);border:1px solid var(--surface-200);border-radius:10px;padding:1rem 1.25rem}
    .stat-card i{font-size:1.5rem;color:var(--usco-vinotinto);width:36px;text-align:center}
    .stat-num{display:block;font-size:1.6rem;font-weight:700;color:var(--usco-gris-dark);line-height:1}
    .stat-lbl{font-size:.78rem;color:var(--surface-500);margin-top:.15rem;display:block}

    .isbn-badge{font-size:.75rem;color:var(--surface-400);margin-top:.2rem}
    .ejemplares-badge{display:inline-flex;align-items:center;justify-content:center;background:rgba(143,20,27,.1);color:var(--usco-vinotinto);font-weight:700;font-size:.9rem;width:36px;height:36px;border-radius:50%}

    .form-grid{display:flex;flex-direction:column;gap:1rem}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .form-group{display:flex;flex-direction:column;gap:.35rem}
    .form-group label{font-size:.85rem;font-weight:600;color:var(--surface-600)}
    .w-full{width:100%}
    @media(max-width:768px){.stats-row{grid-template-columns:1fr}.form-row{grid-template-columns:1fr}}
  `,
})
export class AdminBibliotecaComponent implements OnInit {
  private fs = inject(FirestoreService);
  private confirm = inject(ConfirmationService);
  private msg = inject(MessageService);

  items = signal<LibroItem[]>([]);
  filteredItems = signal<LibroItem[]>([]);
  dialogVisible = false;
  isEdit = false;
  saving = signal(false);
  searchTerm = '';
  form: LibroItem = this.emptyForm();

  ngOnInit() {
    this.fs.getCollection<LibroItem>('libros').subscribe(d => {
      this.items.set(d || []);
      this.filterItems();
    });
  }

  emptyForm(): LibroItem {
    return { titulo: '', autor: '', editorial: '', ejemplares: 1, anio: '', isbn: '', descripcion: '' };
  }

  openNew() {
    this.form = this.emptyForm();
    this.isEdit = false;
    this.dialogVisible = true;
  }

  editItem(item: LibroItem) {
    this.form = { ...item };
    this.isEdit = true;
    this.dialogVisible = true;
  }

  filterItems() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) { this.filteredItems.set(this.items()); return; }
    this.filteredItems.set(
      this.items().filter(l =>
        (l.titulo || '').toLowerCase().includes(term) ||
        (l.autor || '').toLowerCase().includes(term) ||
        (l.editorial || '').toLowerCase().includes(term)
      )
    );
  }

  totalEjemplares(): number {
    return this.items().reduce((acc, l) => acc + (l.ejemplares || 0), 0);
  }

  async save() {
    if (!this.form.titulo || !this.form.autor || !this.form.editorial) {
      this.msg.add({ severity: 'warn', summary: 'Atención', detail: 'Título, Autor y Editorial son obligatorios' });
      return;
    }
    this.saving.set(true);
    try {
      const data: LibroItem = {
        titulo: this.form.titulo.trim(),
        autor: this.form.autor.trim(),
        editorial: this.form.editorial.trim(),
        ejemplares: this.form.ejemplares || 1,
        anio: this.form.anio?.trim() || '',
        isbn: this.form.isbn?.trim() || '',
        descripcion: this.form.descripcion?.trim() || '',
      };
      if (this.isEdit && this.form.key) {
        await this.fs.updateDocument('libros', this.form.key, data);
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Libro actualizado correctamente' });
      } else {
        await this.fs.addDocument('libros', data);
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Libro creado correctamente' });
      }
      this.dialogVisible = false;
    } catch (err: any) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: err.message });
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(item: LibroItem) {
    this.confirm.confirm({
      message: `¿Eliminar el libro "${item.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'fas fa-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No',
      accept: async () => {
        try {
          await this.fs.deleteDocument('libros', item.key!);
          this.msg.add({ severity: 'success', summary: 'Eliminado', detail: 'Libro eliminado correctamente' });
        } catch (err: any) {
          this.msg.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      },
    });
  }
}
