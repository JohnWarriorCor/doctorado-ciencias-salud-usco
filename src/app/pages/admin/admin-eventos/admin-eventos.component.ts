import { Component, inject, OnInit, signal, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
import { Evento } from '../../../core/models';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, Button, Dialog, InputText, Textarea, ConfirmDialog, Toast],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="admin-hero"><h1><i class="fas fa-calendar-alt"></i> Gestión de {{title}}</h1></div>
    <div class="admin-container">
      <div class="toolbar"><a routerLink="/admin" class="btn-back"><i class="fas fa-arrow-left"></i> Volver</a><p-button label="Nuevo Evento" icon="fas fa-plus" (onClick)="openNew()"/></div>
      <p-table [value]="items()" [paginator]="true" [rows]="10" styleClass="p-datatable-sm p-datatable-striped">
        <ng-template #header><tr><th>Imagen</th><th>Título</th><th>Fecha</th><th style="width:140px">Acciones</th></tr></ng-template>
        <ng-template #body let-item><tr>
          <td>@if(item.img){<img [src]="item.img" style="width:80px;height:50px;object-fit:cover;border-radius:6px"/>}@else{<i class="fas fa-image" style="font-size:1.5rem;color:var(--surface-400)"></i>}</td>
          <td><strong>{{item.titulo}}</strong></td><td>{{item.fechaEvento}}</td>
          <td><p-button icon="fas fa-pen" [rounded]="true" [text]="true" severity="info" (onClick)="editItem(item)"/><p-button icon="fas fa-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(item)"/></td>
        </tr></ng-template>
      </p-table>
      <p-dialog [(visible)]="dialogVisible" [header]="isEdit?'Editar Evento':'Nuevo Evento'" [modal]="true" [style]="{width:'600px'}" [draggable]="false">
        <div class="form-grid">
          <div class="form-group"><label>Título *</label><input pInputText [(ngModel)]="form.titulo" class="w-full"/></div>
          <div class="form-group"><label>Reseña</label><textarea pTextarea [(ngModel)]="form.resenia" rows="4" class="w-full"></textarea></div>
          <div class="form-row"><div class="form-group"><label>Fecha Evento</label><input pInputText [(ngModel)]="form.fechaEvento" class="w-full"/></div><div class="form-group"><label>Fecha Publicación</label><input pInputText [(ngModel)]="form.fechaPublicacion" class="w-full"/></div></div>
          <div class="form-group"><label>URL Enlace</label><input pInputText [(ngModel)]="form.url" class="w-full"/></div>
          <div class="form-group"><label>URL Imagen</label><input pInputText [(ngModel)]="form.img" class="w-full"/></div>
          <div class="form-group"><label>Imagen (archivo)</label><input type="file" accept="image/*" (change)="onFileSelect($event)" class="w-full"/></div>
        </div>
        <ng-template #footer><p-button label="Cancelar" [text]="true" (onClick)="dialogVisible=false"/><p-button label="Guardar" icon="fas fa-save" (onClick)="save()" [loading]="saving()"/></ng-template>
      </p-dialog>
      <p-confirmDialog/><p-toast/>
    </div>
  `,
  styles: `.admin-hero{background:linear-gradient(135deg,#1e262b,#6a1b9a);padding:3.5rem 2rem 2rem;text-align:center}.admin-hero h1{color:white;font-size:1.6rem;display:flex;align-items:center;justify-content:center;gap:.6rem}.admin-container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem}.toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}.btn-back{display:inline-flex;align-items:center;gap:.4rem;color:var(--usco-vinotinto);font-weight:600;font-size:.9rem}.form-grid{display:flex;flex-direction:column;gap:1rem}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.form-group{display:flex;flex-direction:column;gap:.35rem}.form-group label{font-size:.85rem;font-weight:600;color:var(--surface-600)}.w-full{width:100%}`,
})
export class AdminEventosComponent implements OnInit {
  private fs = inject(FirestoreService); private cloudinary = inject(CloudinaryService); private confirm = inject(ConfirmationService); private msg = inject(MessageService); private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  items = signal<Evento[]>([]); dialogVisible = false; isEdit = false; saving = signal(false);
  form: Evento = this.emptyForm(); selectedFile: File | null = null;
  collectionName = 'eventosPrograma'; title = 'Eventos del Programa';

  ngOnInit() {
    const path = this.route.snapshot.routeConfig?.path || '';
    if (path.includes('institucional')) { this.collectionName = 'eventosInstitucionales'; this.title = 'Eventos Institucionales'; }
    this.fs.getCollection<Evento>(this.collectionName).subscribe(d => this.items.set(d));
  }

  emptyForm(): Evento { return { titulo: '', img: '', nameImg: '', resenia: '', parrafo: null, fechaEvento: '', fechaPublicacion: '', url: '' }; }
  openNew() { this.form = this.emptyForm(); this.isEdit = false; this.selectedFile = null; this.dialogVisible = true; }
  editItem(item: any) { this.form = { ...item }; this.isEdit = true; this.selectedFile = null; this.dialogVisible = true; }
  onFileSelect(e: Event) { const i = e.target as HTMLInputElement; if (i.files?.length) this.selectedFile = i.files[0]; }
  async save() {
    if (!this.form.titulo) { this.msg.add({ severity: 'warn', summary: 'Atención', detail: 'Título obligatorio' }); return; }
    this.saving.set(true);
    try {
      if (this.selectedFile) {
        this.form.img = await this.cloudinary.uploadFile(this.selectedFile, 'eventos');
        this.form.nameImg = this.selectedFile.name;
        this.cdr.detectChanges();
      }
      if (this.isEdit && this.form.key) { await this.fs.updateDocument(this.collectionName, this.form.key, this.form); this.msg.add({ severity: 'success', summary: 'Actualizado' }); }
      else { await this.fs.addDocument(this.collectionName, this.form); this.msg.add({ severity: 'success', summary: 'Creado' }); }
      this.dialogVisible = false;
    } catch (err: any) { this.msg.add({ severity: 'error', summary: 'Error', detail: err.message }); } finally { this.saving.set(false); }
  }
  confirmDelete(item: any) { this.confirm.confirm({ message: `¿Eliminar "${item.titulo}"?`, header: 'Confirmar', acceptLabel: 'Sí', rejectLabel: 'No', accept: async () => { try { await this.fs.deleteDocument(this.collectionName, item.key); this.msg.add({ severity: 'success', summary: 'Eliminado' }); } catch (err: any) { this.msg.add({ severity: 'error', detail: err.message }); } } }); }
}
