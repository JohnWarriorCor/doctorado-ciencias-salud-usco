import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FirestoreService } from '../../../core/services/firestore.service';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { Docente } from '../../../core/models';

@Component({
  selector: 'app-admin-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, Button, Dialog, InputText, Textarea, ConfirmDialog, Toast],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="admin-hero"><h1><i class="fas fa-chalkboard-teacher"></i> Gestión de Docentes</h1></div>
    <div class="admin-container">
      <div class="toolbar">
        <a routerLink="/admin" class="btn-back"><i class="fas fa-arrow-left"></i> Volver</a>
        <p-button label="Nuevo Docente" icon="fas fa-plus" (onClick)="openNew()" />
      </div>
      <p-table [value]="items()" [paginator]="true" [rows]="10" styleClass="p-datatable-sm p-datatable-striped">
        <ng-template #header><tr><th>Foto</th><th>Nombre</th><th>Correo</th><th style="width:140px">Acciones</th></tr></ng-template>
        <ng-template #body let-item>
          <tr>
            <td>@if(item.foto){<img [src]="item.foto" style="width:45px;height:45px;border-radius:50%;object-fit:cover"/>}@else{<i class="fas fa-user-circle" style="font-size:2rem;color:var(--surface-400)"></i>}</td>
            <td><strong>{{item.nombre}}</strong></td>
            <td style="font-size:.85rem">{{item.correo}}</td>
            <td>
              <p-button icon="fas fa-pen" [rounded]="true" [text]="true" severity="info" (onClick)="editItem(item)"/>
              <p-button icon="fas fa-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(item)"/>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage><tr><td colspan="4" style="text-align:center;padding:2rem">No hay docentes</td></tr></ng-template>
      </p-table>
      <p-dialog [(visible)]="dialogVisible" [header]="isEdit ? 'Editar Docente' : 'Nuevo Docente'" [modal]="true" [style]="{width:'600px'}" [draggable]="false">
        <div class="form-grid">
          <div class="form-group"><label>Nombre *</label><input pInputText [(ngModel)]="form.nombre" class="w-full"/></div>
          <div class="form-group"><label>Síntesis</label><textarea pTextarea [(ngModel)]="form.sintesis" rows="4" class="w-full"></textarea></div>
          <div class="form-row">
            <div class="form-group"><label>Correo</label><input pInputText [(ngModel)]="form.correo" class="w-full"/></div>
            <div class="form-group"><label>Fecha</label><input pInputText [(ngModel)]="form.fecha" class="w-full"/></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>CvLAC</label><input pInputText [(ngModel)]="form.cvlac" class="w-full"/></div>
            <div class="form-group"><label>ORCID</label><input pInputText [(ngModel)]="form.orcid" class="w-full"/></div>
          </div>
          <div class="form-group"><label>URL Foto</label><input pInputText [(ngModel)]="form.foto" class="w-full"/></div>
          <div class="form-group"><label>Foto (archivo)</label><input type="file" accept="image/*" (change)="onFileSelect($event)" class="w-full"/></div>
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
    .admin-hero{background:linear-gradient(135deg,#1e262b,#0d47a1);padding:3.5rem 2rem 2rem;text-align:center}
    .admin-hero h1{color:white;font-size:1.6rem;display:flex;align-items:center;justify-content:center;gap:.6rem}
    .admin-container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem}
    .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
    .btn-back{display:inline-flex;align-items:center;gap:.4rem;color:var(--usco-vinotinto);font-weight:600;font-size:.9rem}
    .form-grid{display:flex;flex-direction:column;gap:1rem}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .form-group{display:flex;flex-direction:column;gap:.35rem}
    .form-group label{font-size:.85rem;font-weight:600;color:var(--surface-600)}
    .w-full{width:100%}
  `,
})
export class AdminDocentesComponent implements OnInit {
  private fs = inject(FirestoreService);
  private cloudinary = inject(CloudinaryService);
  private confirm = inject(ConfirmationService);
  private msg = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  items = signal<Docente[]>([]);
  dialogVisible = false; isEdit = false; saving = signal(false);
  form: Docente = this.emptyForm();
  selectedFile: File | null = null;

  ngOnInit() { this.fs.getCollection<Docente>('docentes').subscribe(d => this.items.set(d)); }
  emptyForm(): Docente { return { foto: '', nombre: '', sintesis: '', fieldArray: [], fieldArrayArticulos: [], correo: '', fecha: '', cvlac: '', orcid: '' }; }
  openNew() { this.form = this.emptyForm(); this.isEdit = false; this.selectedFile = null; this.dialogVisible = true; }
  editItem(item: any) { this.form = { ...item }; this.isEdit = true; this.selectedFile = null; this.dialogVisible = true; }
  onFileSelect(e: Event) { const i = e.target as HTMLInputElement; if (i.files?.length) this.selectedFile = i.files[0]; }

  async save() {
    if (!this.form.nombre) { this.msg.add({ severity: 'warn', summary: 'Atención', detail: 'Nombre obligatorio' }); return; }
    this.saving.set(true);
    try {
      if (this.selectedFile) {
        this.form.foto = await this.cloudinary.uploadFile(this.selectedFile, 'docentes');
        this.cdr.detectChanges();
      }
      if (this.isEdit && this.form.key) { await this.fs.updateDocument('docentes', this.form.key, this.form); this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Docente actualizado' }); }
      else { await this.fs.addDocument('docentes', this.form); this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Docente creado' }); }
      this.dialogVisible = false;
    } catch (err: any) { this.msg.add({ severity: 'error', summary: 'Error', detail: err.message }); }
    finally { this.saving.set(false); }
  }

  confirmDelete(item: any) {
    this.confirm.confirm({ message: `¿Eliminar a "${item.nombre}"?`, header: 'Confirmar', icon: 'fas fa-exclamation-triangle', acceptLabel: 'Sí', rejectLabel: 'No',
      accept: async () => { try { await this.fs.deleteDocument('docentes', item.key); this.msg.add({ severity: 'success', summary: 'Eliminado', detail: 'Docente eliminado' }); } catch (err: any) { this.msg.add({ severity: 'error', summary: 'Error', detail: err.message }); } },
    });
  }
}
