import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FirestoreService } from '../../../core/services/firestore.service';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { Carrusel } from '../../../core/models';

@Component({
  selector: 'app-admin-carrusel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, Button, Dialog, InputText, Textarea, Select, Tag, ConfirmDialog, Toast],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="admin-hero"><h1><i class="fas fa-images"></i> Gestión del Carrusel</h1></div>
    <div class="admin-container">
      <div class="toolbar">
        <a routerLink="/admin" class="btn-back"><i class="fas fa-arrow-left"></i> Volver</a>
        <p-button label="Nuevo Slide" icon="fas fa-plus" (onClick)="openNew()" />
      </div>

      <p-table [value]="items()" [paginator]="true" [rows]="10" styleClass="p-datatable-sm p-datatable-striped" [globalFilterFields]="['titulo']">
        <ng-template #header>
          <tr><th>Imagen</th><th>Título</th><th>Fecha</th><th>Estado</th><th style="width:140px">Acciones</th></tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td><img [src]="item.urlImg" [alt]="item.titulo" style="width:80px;height:50px;object-fit:cover;border-radius:6px"/></td>
            <td><strong>{{item.titulo}}</strong><br/><small style="color:var(--surface-600)">{{item.info?.slice(0,60)}}</small></td>
            <td>{{item.fecha}}</td>
            <td><p-tag [value]="item.estado === 1 ? 'Activo' : 'Inactivo'" [severity]="item.estado === 1 ? 'success' : 'danger'"/></td>
            <td>
              <p-button icon="fas fa-pen" [rounded]="true" [text]="true" severity="info" (onClick)="editItem(item)" />
              <p-button icon="fas fa-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(item)" />
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage><tr><td colspan="5" style="text-align:center;padding:2rem">No hay slides registrados</td></tr></ng-template>
      </p-table>

      <p-dialog [(visible)]="dialogVisible" [header]="isEdit ? 'Editar Slide' : 'Nuevo Slide'" [modal]="true" [style]="{width:'550px'}" [draggable]="false">
        <div class="form-grid">
          <div class="form-group"><label>Título *</label><input pInputText [(ngModel)]="form.titulo" class="w-full"/></div>
          <div class="form-group"><label>Descripción</label><textarea pTextarea [(ngModel)]="form.info" rows="3" class="w-full"></textarea></div>
          <div class="form-group"><label>Fecha</label><input pInputText [(ngModel)]="form.fecha" class="w-full" placeholder="DD/MM/YYYY"/></div>
          <div class="form-group"><label>URL Imagen</label><input pInputText [(ngModel)]="form.urlImg" class="w-full"/></div>
          <div class="form-group"><label>URL Información</label><input pInputText [(ngModel)]="form.urlInfo" class="w-full"/></div>
          <div class="form-group">
            <label>Imagen (archivo)</label>
            <div class="file-drop-zone" (click)="fileInput.click()" [class.has-file]="!!previewUrl">
              <input #fileInput type="file" accept="image/*" (change)="onFileSelect($event)" style="display:none"/>
              @if(previewUrl){
                <img [src]="previewUrl" class="img-prev-rect" alt="Vista previa"/>
                <span class="file-drop-hint" style="margin-top:.4rem">{{selectedFile?.name || 'Imagen actual · clic para cambiar'}}</span>
              } @else {
                <div class="file-drop-content">
                  <i class="fas fa-image"></i>
                  <span class="file-drop-text">Haz clic para seleccionar imagen</span>
                  <span class="file-drop-hint">PNG, JPG, WEBP · Recomendado 1200×600 px</span>
                </div>
              }
            </div>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <p-select [(ngModel)]="form.estado" [options]="estadoOptions" optionLabel="label" optionValue="value" class="w-full"/>
          </div>
        </div>
        <ng-template #footer>
          <p-button label="Cancelar" icon="fas fa-times" [text]="true" (onClick)="dialogVisible=false"/>
          <p-button label="Guardar" icon="fas fa-save" (onClick)="save()" [loading]="saving()"/>
        </ng-template>
      </p-dialog>
      <p-confirmDialog/>
      <p-toast/>
    </div>
  `,
  styles: `
    .admin-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:3.5rem 2rem 2rem;text-align:center}
    .admin-hero h1{color:white;font-size:1.6rem;display:flex;align-items:center;justify-content:center;gap:.6rem}
    .admin-container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem}
    .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
    .btn-back{display:inline-flex;align-items:center;gap:.4rem;color:var(--usco-vinotinto);font-weight:600;font-size:.9rem}
    .btn-back:hover{text-decoration:underline}
    .form-grid{display:flex;flex-direction:column;gap:1rem}
    .form-group{display:flex;flex-direction:column;gap:.35rem}
    .form-group label{font-size:.85rem;font-weight:600;color:var(--surface-600)}
    .w-full{width:100%}
    .file-drop-zone{border:2px dashed var(--surface-300);border-radius:12px;padding:1.25rem;cursor:pointer;transition:all .25s;background:var(--surface-50);text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100px}
    .file-drop-zone:hover,.file-drop-zone.has-file{border-color:var(--usco-vinotinto);background:#fef2f3}
    .file-drop-zone.has-file{border-style:solid}
    .file-drop-content{display:flex;flex-direction:column;align-items:center;gap:.35rem}
    .file-drop-content i{font-size:2rem;color:var(--usco-vinotinto);opacity:.65}
    .file-drop-text{font-size:.87rem;font-weight:600;color:var(--surface-700)}
    .file-drop-hint{font-size:.75rem;color:var(--surface-400)}
    .img-prev-rect{width:100%;max-height:160px;object-fit:cover;border-radius:8px}
  `,
})
export class AdminCarruselComponent implements OnInit {
  private fs = inject(FirestoreService);
  private cloudinary = inject(CloudinaryService);
  private confirm = inject(ConfirmationService);
  private msg = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  items = signal<Carrusel[]>([]);
  dialogVisible = false;
  isEdit = false;
  saving = signal(false);
  form: Carrusel = this.emptyForm();
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  estadoOptions = [{ label: 'Activo', value: 1 }, { label: 'Inactivo', value: 0 }];

  ngOnInit() {
    this.fs.getCollection<Carrusel>('carrusel').subscribe(d => this.items.set(d));
  }

  emptyForm(): Carrusel {
    return { titulo: '', urlImg: '', nameImg: '', urlInfo: '', fecha: '', info: '', estado: 1 };
  }

  openNew() { this.form = this.emptyForm(); this.isEdit = false; this.selectedFile = null; this.previewUrl = null; this.dialogVisible = true; }

  editItem(item: any) { this.form = { ...item }; this.isEdit = true; this.selectedFile = null; this.previewUrl = item.urlImg || null; this.dialogVisible = true; }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async save() {
    if (!this.form.titulo) { this.msg.add({ severity: 'warn', summary: 'Atención', detail: 'El título es obligatorio' }); return; }
    this.saving.set(true);
    try {
      if (this.selectedFile) {
        this.form.urlImg = await this.cloudinary.uploadFile(this.selectedFile, 'carrusel');
        this.form.nameImg = this.selectedFile.name;
        this.cdr.detectChanges();
      }
      if (this.isEdit && this.form.key) {
        await this.fs.updateDocument('carrusel', this.form.key, this.form);
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Slide actualizado' });
      } else {
        await this.fs.addDocument('carrusel', this.form);
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Slide creado' });
      }
      this.dialogVisible = false;
    } catch (err: any) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: err.message });
    } finally { this.saving.set(false); }
  }

  confirmDelete(item: any) {
    this.confirm.confirm({
      message: `¿Eliminar el slide "${item.titulo}"?`, header: 'Confirmar', icon: 'fas fa-exclamation-triangle', acceptLabel: 'Sí, eliminar', rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          await this.fs.deleteDocument('carrusel', item.key!);
          this.msg.add({ severity: 'success', summary: 'Eliminado', detail: 'Slide eliminado correctamente' });
        } catch (err: any) { this.msg.add({ severity: 'error', summary: 'Error', detail: err.message }); }
      },
    });
  }
}
