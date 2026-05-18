import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Denominacion } from '../../../core/models';

@Component({
  selector: 'app-admin-denominacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Button, Dialog, InputText, Textarea, Toast],
  providers: [MessageService],
  template: `
    <p-toast />

    <!-- Hero -->
    <div class="denom-hero">
      <div class="denom-hero-content">
        <div class="denom-hero-icon"><i class="fas fa-university"></i></div>
        <h1>Denominación del Programa</h1>
        <p>Gestión de la información institucional del Doctorado en Ciencias de la Salud</p>
      </div>
    </div>

    <div class="denom-container">
      <!-- Toolbar -->
      <div class="toolbar">
        <a routerLink="/admin" class="btn-back"><i class="fas fa-arrow-left"></i> Volver al Panel</a>
        @if (!record()) {
          <p-button label="Crear Información" icon="fas fa-plus" (onClick)="openCreate()" />
        }
      </div>

      <!-- Estado: sin datos -->
      @if (!record() && !loading()) {
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-book-open"></i></div>
          <h3>Sin información registrada</h3>
          <p>Crea el registro de denominación del programa para que aparezca en la página de inicio.</p>
          <p-button label="Crear Ahora" icon="fas fa-plus" (onClick)="openCreate()" />
        </div>
      }

      @if (loading()) {
        <div class="loading-state">
          <i class="fas fa-spinner fa-spin"></i><span>Cargando información...</span>
        </div>
      }

      <!-- Tarjetas de resumen con tabs -->
      @if (record(); as d) {
        <div class="denom-tabs">
          <button class="denom-tab" [class.active]="activeTab()===0" (click)="activeTab.set(0)">
            <i class="fas fa-list"></i> Programa
          </button>
          <button class="denom-tab" [class.active]="activeTab()===1" (click)="activeTab.set(1)">
            <i class="fas fa-flag"></i> Misión y Visión
          </button>
          <button class="denom-tab" [class.active]="activeTab()===2" (click)="activeTab.set(2)">
            <i class="fas fa-bullseye"></i> Propósito
          </button>
        </div>

        <!-- TAB 0: PROGRAMA -->
        @if (activeTab() === 0) {
          <div class="tab-panel animate-in">
            <div class="tab-header">
              <h3><i class="fas fa-list"></i> Información del Programa</h3>
              <p-button label="Editar" icon="fas fa-pen" size="small" (onClick)="openEdit(d)" />
            </div>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">Nombre del programa</span><span class="info-value">{{ d.nombrePrograma || '—' }}</span></div>
              <div class="info-item"><span class="info-label">Título a otorgar</span><span class="info-value">{{ d.tituloOtorgar || '—' }}</span></div>
              <div class="info-item full">
                <span class="info-label">Registro calificado</span>
                @if (d.urlRegistroCalificado) {
                  <a [href]="d.urlRegistroCalificado" target="_blank" rel="noopener" class="info-link">{{ d.registroCalificado || '—' }} <i class="fas fa-external-link-alt"></i></a>
                } @else {
                  <span class="info-value">{{ d.registroCalificado || '—' }}</span>
                }
              </div>
              <div class="info-item full">
                <span class="info-label">Renovación registro calificado</span>
                @if (d.urlRenovacionRegistro) {
                  <a [href]="d.urlRenovacionRegistro" target="_blank" rel="noopener" class="info-link">{{ d.renovacionRegistro || '—' }} <i class="fas fa-external-link-alt"></i></a>
                } @else {
                  <span class="info-value">{{ d.renovacionRegistro || '—' }}</span>
                }
              </div>
              <div class="info-item"><span class="info-label">Modalidad</span><span class="info-value"><span class="badge-modalidad">{{ d.modalidad || '—' }}</span></span></div>
              <div class="info-item"><span class="info-label">Periodicidad de admisión</span><span class="info-value">{{ d.periodicidadAdmision || '—' }}</span></div>
              <div class="info-item"><span class="info-label">Número de créditos</span><span class="info-value"><strong class="badge-num">{{ d.numeroCreditos || '—' }}</strong></span></div>
              <div class="info-item"><span class="info-label">Duración</span><span class="info-value">{{ d.duracion || '—' }}</span></div>
              <div class="info-item full">
                <span class="info-label">Costo de matrícula</span>
                @if (d.urlCostoMatricula) {
                  <a [href]="d.urlCostoMatricula" target="_blank" rel="noopener" class="info-link">{{ d.costoMatricula || '—' }} <i class="fas fa-external-link-alt"></i></a>
                } @else {
                  <span class="info-value">{{ d.costoMatricula || '—' }}</span>
                }
              </div>
              <div class="info-item full"><span class="info-label">Cupo por corte</span><span class="info-value">{{ d.cupoPorCorte || '—' }}</span></div>
              <div class="info-item">
                <span class="info-label">SNIES</span>
                @if (d.urlSnies) {
                  <a [href]="d.urlSnies" target="_blank" rel="noopener" class="info-link"><code class="code-snies">{{ d.snies || '—' }}</code> <i class="fas fa-external-link-alt"></i></a>
                } @else {
                  <span class="info-value"><code class="code-snies">{{ d.snies || '—' }}</code></span>
                }
              </div>
            </div>
          </div>
        }

        <!-- TAB 1: MISIÓN Y VISIÓN -->
        @if (activeTab() === 1) {
          <div class="tab-panel animate-in">
            <div class="tab-header">
              <h3><i class="fas fa-flag"></i> Misión y Visión</h3>
              <p-button label="Editar" icon="fas fa-pen" size="small" (onClick)="openEdit(d)" />
            </div>
            <div class="mv-grid">
              <div class="mv-card mision-card">
                <div class="mv-card-header"><i class="fas fa-bullseye"></i><h4>Misión</h4></div>
                <p>{{ d.mision || 'No registrada' }}</p>
              </div>
              <div class="mv-card vision-card">
                <div class="mv-card-header"><i class="fas fa-eye"></i><h4>Visión</h4></div>
                <p>{{ d.vision || 'No registrada' }}</p>
              </div>
            </div>
          </div>
        }

        <!-- TAB 2: PROPÓSITO -->
        @if (activeTab() === 2) {
          <div class="tab-panel animate-in">
            <div class="tab-header">
              <h3><i class="fas fa-bullseye"></i> Propósito</h3>
              <p-button label="Editar" icon="fas fa-pen" size="small" (onClick)="openEdit(d)" />
            </div>
            <div class="proposito-section">
              <div class="proposito-card">
                <p>{{ d.proposito || 'No registrado' }}</p>
              </div>
              <div class="proposito-lists-grid">
                <div class="proposito-list-card">
                  <h4><i class="fas fa-map-marker-alt"></i> Necesidades del País y la Región Surcolombiana</h4>
                  <ul>
                    @for (item of splitLines(d.necesidadesPais); track item) {
                      <li>{{ item }}</li>
                    }
                    @if (!d.necesidadesPais) { <li class="empty-li">No registradas</li> }
                  </ul>
                </div>
                <div class="proposito-list-card">
                  <h4><i class="fas fa-flask"></i> Áreas Académicas del Doctorado</h4>
                  <ul>
                    @for (item of splitLines(d.areasAcademicas); track item) {
                      <li>{{ item }}</li>
                    }
                    @if (!d.areasAcademicas) { <li class="empty-li">No registradas</li> }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        }
      }
    </div>

    <!-- ===== DIALOG EDICIÓN ===== -->
    <p-dialog [(visible)]="dialogVisible" header="Editar Denominación del Programa"
              [modal]="true" [style]="{width:'760px', maxWidth:'95vw'}" [draggable]="false"
              [resizable]="false" styleClass="denom-dialog">
      <div class="dialog-tabs">
        <button class="dtab" [class.active]="dialogTab()===0" (click)="dialogTab.set(0)">Programa</button>
        <button class="dtab" [class.active]="dialogTab()===1" (click)="dialogTab.set(1)">Misión y Visión</button>
        <button class="dtab" [class.active]="dialogTab()===2" (click)="dialogTab.set(2)">Propósito</button>
      </div>

      <!-- TAB PROGRAMA -->
      @if (dialogTab() === 0) {
        <div class="form-section">
          <div class="form-row-2">
            <div class="form-group">
              <label>Nombre del programa *</label>
              <input pInputText [(ngModel)]="form.nombrePrograma" placeholder="Ej: Doctorado en Ciencias de la Salud" class="w-full"/>
            </div>
            <div class="form-group">
              <label>Título a otorgar *</label>
              <input pInputText [(ngModel)]="form.tituloOtorgar" placeholder="Ej: Doctor en Ciencias de la Salud" class="w-full"/>
            </div>
          </div>
          <div class="form-group">
            <label>Registro calificado</label>
            <input pInputText [(ngModel)]="form.registroCalificado" placeholder="Ej: Resoluciones 09862 del 18 de mayo de 2016 y 19905 del 18 de octubre de 2016" class="w-full"/>
            <div class="url-row">
              <i class="fas fa-link"></i>
              <input pInputText [(ngModel)]="form.urlRegistroCalificado" placeholder="https://enlace-al-documento.pdf (opcional)" class="w-full url-input"/>
            </div>
          </div>
          <div class="form-group">
            <label>Renovación registro calificado</label>
            <input pInputText [(ngModel)]="form.renovacionRegistro" placeholder="Ej: Resolución 011578 del 23 de junio de 2022..." class="w-full"/>
            <div class="url-row">
              <i class="fas fa-link"></i>
              <input pInputText [(ngModel)]="form.urlRenovacionRegistro" placeholder="https://enlace-al-documento.pdf (opcional)" class="w-full url-input"/>
            </div>
          </div>
          <div class="form-row-3">
            <div class="form-group">
              <label>Modalidad</label>
              <input pInputText [(ngModel)]="form.modalidad" placeholder="Ej: Presencial" class="w-full"/>
            </div>
            <div class="form-group">
              <label>Periodicidad de admisión</label>
              <input pInputText [(ngModel)]="form.periodicidadAdmision" placeholder="Ej: Anual" class="w-full"/>
            </div>
            <div class="form-group">
              <label>Número de créditos</label>
              <input pInputText [(ngModel)]="form.numeroCreditos" placeholder="Ej: 128" class="w-full"/>
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label>Duración</label>
              <input pInputText [(ngModel)]="form.duracion" placeholder="Ej: Hasta cuatro (4) años" class="w-full"/>
            </div>
            <div class="form-group">
              <label>SNIES</label>
              <input pInputText [(ngModel)]="form.snies" placeholder="Código SNIES" class="w-full"/>
              <div class="url-row">
                <i class="fas fa-link"></i>
                <input pInputText [(ngModel)]="form.urlSnies" placeholder="https://snies.mineducacion.gov.co/... (opcional)" class="w-full url-input"/>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Costo de matrícula</label>
            <input pInputText [(ngModel)]="form.costoMatricula" placeholder="Ej: 9 SMMLV (Artículo 13...)" class="w-full"/>
            <div class="url-row">
              <i class="fas fa-link"></i>
              <input pInputText [(ngModel)]="form.urlCostoMatricula" placeholder="https://enlace-a-normativa.pdf (opcional)" class="w-full url-input"/>
            </div>
          </div>
          <div class="form-group">
            <label>Cupo por corte</label>
            <input pInputText [(ngModel)]="form.cupoPorCorte" placeholder="Ej: De cuatro (4) a seis (6) por cohorte" class="w-full"/>
          </div>
        </div>
      }

      <!-- TAB MISIÓN Y VISIÓN -->
      @if (dialogTab() === 1) {
        <div class="form-section">
          <div class="form-group">
            <label>Misión *</label>
            <textarea pTextarea [(ngModel)]="form.mision" [rows]="6" placeholder="Texto completo de la Misión..." class="w-full" autoResize="true"></textarea>
          </div>
          <div class="form-group">
            <label>Visión *</label>
            <textarea pTextarea [(ngModel)]="form.vision" [rows]="6" placeholder="Texto completo de la Visión..." class="w-full" autoResize="true"></textarea>
          </div>
        </div>
      }

      <!-- TAB PROPÓSITO -->
      @if (dialogTab() === 2) {
        <div class="form-section">
          <div class="form-group">
            <label>Propósito del programa *</label>
            <textarea pTextarea [(ngModel)]="form.proposito" [rows]="5" placeholder="Texto del propósito del Doctorado..." class="w-full" autoResize="true"></textarea>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label>Necesidades del País y la Región <span class="hint">(una por línea)</span></label>
              <textarea pTextarea [(ngModel)]="form.necesidadesPais" [rows]="5" placeholder="Población que no recibe servicios de salud.\nEnfermedades tropicales.\n..." class="w-full" autoResize="true"></textarea>
            </div>
            <div class="form-group">
              <label>Áreas Académicas del Doctorado <span class="hint">(una por línea)</span></label>
              <textarea pTextarea [(ngModel)]="form.areasAcademicas" [rows]="5" placeholder="Salud de poblaciones.\nMedicina Tropical.\n..." class="w-full" autoResize="true"></textarea>
            </div>
          </div>
        </div>
      }

      <ng-template #footer>
        <p-button label="Cancelar" icon="fas fa-times" [text]="true" (onClick)="dialogVisible = false"/>
        <p-button label="Guardar Cambios" icon="fas fa-save" (onClick)="save()" [loading]="saving()"/>
      </ng-template>
    </p-dialog>
  `,
  styles: `
    /* ===== HERO ===== */
    .denom-hero {
      background: linear-gradient(135deg, #1e262b 0%, #8f141b 60%, #5c0e12 100%);
      padding: 4rem 2rem 3rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .denom-hero::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -20%;
      width: 60%;
      height: 200%;
      background: radial-gradient(ellipse, rgba(255,255,255,.05) 0%, transparent 70%);
      pointer-events: none;
    }
    .denom-hero-content { position: relative; z-index: 1; }
    .denom-hero-icon {
      width: 72px; height: 72px; border-radius: 20px;
      background: rgba(255,255,255,.12);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem; font-size: 1.8rem; color: white;
    }
    .denom-hero h1 { color: white; font-size: 1.9rem; margin: 0 0 .6rem; }
    .denom-hero p  { color: rgba(255,255,255,.75); font-size: .95rem; margin: 0; }

    /* ===== CONTAINER ===== */
    .denom-container { max-width: 1050px; margin: 0 auto; padding: 2rem 1.5rem; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
    .btn-back { display: inline-flex; align-items: center; gap: .4rem; color: var(--usco-vinotinto); font-weight: 600; font-size: .9rem; transition: color .2s; }
    .btn-back:hover { color: #5c0e12; }

    /* ===== EMPTY / LOADING ===== */
    .empty-state {
      text-align: center; padding: 4rem 2rem;
      background: var(--surface-50); border-radius: 16px;
      border: 2px dashed var(--surface-200);
    }
    .empty-icon { font-size: 3rem; color: var(--surface-300); margin-bottom: 1rem; }
    .empty-state h3 { color: var(--surface-600); margin-bottom: .5rem; }
    .empty-state p  { color: var(--surface-400); margin-bottom: 1.5rem; }
    .loading-state {
      display: flex; align-items: center; gap: .75rem; justify-content: center;
      padding: 3rem; color: var(--surface-400); font-size: 1rem;
    }

    /* ===== TABS ===== */
    .denom-tabs {
      display: flex; gap: .5rem;
      background: var(--surface-100); border-radius: 12px;
      padding: .4rem; margin-bottom: 1.75rem;
    }
    .denom-tab {
      flex: 1; padding: .7rem 1rem; border: none; border-radius: 8px;
      background: transparent; cursor: pointer; font-weight: 600; font-size: .88rem;
      color: var(--surface-500); transition: all .25s; display: flex; align-items: center; justify-content: center; gap: .4rem;
    }
    .denom-tab.active { background: white; color: var(--usco-vinotinto); box-shadow: 0 2px 8px rgba(0,0,0,.1); }
    .denom-tab:hover:not(.active) { color: var(--surface-700); background: rgba(255,255,255,.5); }

    /* ===== TAB PANEL ===== */
    .tab-panel { animation: fadeSlide .3s ease; }
    @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .animate-in { animation: fadeSlide .3s ease; }

    .tab-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .tab-header h3 {
      font-size: 1.1rem; color: var(--usco-gris-dark); display: flex; align-items: center; gap: .5rem;
      margin: 0;
    }
    .tab-header h3 i { color: var(--usco-vinotinto); }

    /* ===== INFO GRID (Pestaña Programa) ===== */
    .info-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: .75rem;
    }
    .info-item {
      background: var(--surface-50); border-radius: 10px; padding: 1rem 1.25rem;
      border-left: 3px solid var(--surface-200);
      transition: border-color .2s;
    }
    .info-item:hover { border-left-color: var(--usco-vinotinto); }
    .info-item.full { grid-column: 1 / -1; }
    .info-label { display: block; font-size: .78rem; font-weight: 700; color: var(--usco-vinotinto); text-transform: uppercase; letter-spacing: .04em; margin-bottom: .3rem; }
    .info-value { display: block; font-size: .93rem; color: var(--surface-700); line-height: 1.5; }
    .badge-modalidad {
      display: inline-block; padding: .25rem .8rem; border-radius: 20px;
      background: #fce4ec; color: #8f141b; font-weight: 700; font-size: .85rem;
    }
    .badge-num {
      font-size: 1.3rem; color: var(--usco-vinotinto);
    }
    .code-snies {
      background: var(--surface-100); color: var(--surface-600);
      padding: .2rem .6rem; border-radius: 4px; font-size: .85rem;
    }

    /* ===== MISIÓN Y VISIÓN ===== */
    .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .mv-card {
      border-radius: 14px; padding: 1.75rem;
      background: var(--surface-50);
    }
    .mision-card { border-top: 4px solid var(--usco-vinotinto); }
    .vision-card  { border-top: 4px solid #1a73e8; }
    .mv-card-header { display: flex; align-items: center; gap: .6rem; margin-bottom: 1rem; }
    .mv-card-header i { font-size: 1.2rem; }
    .mision-card .mv-card-header i { color: var(--usco-vinotinto); }
    .vision-card  .mv-card-header i { color: #1a73e8; }
    .mv-card-header h4 { margin: 0; font-size: 1rem; color: var(--usco-gris-dark); }
    .mv-card p { color: var(--surface-600); line-height: 1.75; font-size: .92rem; margin: 0; }

    /* ===== PROPÓSITO ===== */
    .proposito-card {
      background: linear-gradient(135deg, #fce4ec, #f8f9fa);
      border-radius: 14px; padding: 1.75rem; margin-bottom: 1.5rem;
      border-left: 4px solid var(--usco-vinotinto);
    }
    .proposito-card p { color: var(--surface-700); line-height: 1.8; font-size: .93rem; margin: 0; }
    .proposito-lists-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .proposito-list-card {
      background: var(--surface-50); border-radius: 12px; padding: 1.5rem;
    }
    .proposito-list-card h4 { font-size: .92rem; color: var(--usco-gris-dark); margin: 0 0 .85rem; display: flex; align-items: center; gap: .4rem; }
    .proposito-list-card h4 i { color: var(--usco-vinotinto); }
    .proposito-list-card ul { list-style: none; padding: 0; margin: 0; }
    .proposito-list-card ul li {
      padding: .45rem 0; border-bottom: 1px solid var(--surface-100);
      color: var(--surface-600); font-size: .88rem;
      display: flex; align-items: center; gap: .5rem;
    }
    .proposito-list-card ul li::before { content: '●'; color: var(--usco-vinotinto); font-size: .5rem; flex-shrink: 0; }
    .proposito-list-card ul li.empty-li::before { display: none; }
    .proposito-list-card ul li:last-child { border-bottom: none; }

    /* ===== DIALOG TABS ===== */
    .dialog-tabs { display: flex; gap: .4rem; background: var(--surface-100); border-radius: 8px; padding: .3rem; margin-bottom: 1.5rem; }
    .dtab { flex: 1; padding: .55rem .5rem; border: none; border-radius: 6px; background: transparent; cursor: pointer; font-weight: 600; font-size: .85rem; color: var(--surface-500); transition: all .2s; }
    .dtab.active { background: white; color: var(--usco-vinotinto); box-shadow: 0 1px 4px rgba(0,0,0,.1); }

    /* ===== FORM ===== */
    .form-section { display: flex; flex-direction: column; gap: 1rem; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: .35rem; }
    .form-group label { font-size: .83rem; font-weight: 700; color: var(--surface-600); }
    .form-group .hint { font-weight: 400; color: var(--surface-400); font-size: .78rem; }
    .w-full { width: 100%; }
    .url-row { display: flex; align-items: center; gap: .4rem; margin-top: .1rem; }
    .url-row > i { color: var(--usco-vinotinto); font-size: .8rem; flex-shrink: 0; opacity: .7; }
    .url-input { font-size: .82rem !important; }
    .info-link { color: var(--usco-vinotinto); text-decoration: none; font-size: .93rem; line-height: 1.5; display: inline-flex; align-items: center; gap: .35rem; font-weight: 500; transition: color .2s; }
    .info-link:hover { color: #5c0e12; text-decoration: underline; }
    .info-link i { font-size: .7rem; opacity: .8; flex-shrink: 0; }

    @media (max-width: 768px) {
      .info-grid, .mv-grid, .proposito-lists-grid, .form-row-2, .form-row-3 { grid-template-columns: 1fr; }
      .denom-tabs { flex-direction: column; }
    }
  `,
})
export class AdminDenominacionComponent implements OnInit {
  private fs = inject(FirestoreService);
  private msg = inject(MessageService);

  record  = signal<Denominacion | null>(null);
  loading = signal(true);
  saving  = signal(false);
  dialogVisible = false;
  activeTab  = signal(0);
  dialogTab  = signal(0);

  form: Denominacion = this.emptyForm();

  ngOnInit(): void {
    this.fs.getCollection<Denominacion>('denominacion').subscribe(data => {
      this.loading.set(false);
      this.record.set(data?.length ? data[0] : null);
    });
  }

  emptyForm(): Denominacion {
    return {
      nombrePrograma: '', tituloOtorgar: '',
      registroCalificado: '', urlRegistroCalificado: '',
      renovacionRegistro: '', urlRenovacionRegistro: '',
      modalidad: '', periodicidadAdmision: '',
      numeroCreditos: '', duracion: '',
      costoMatricula: '', urlCostoMatricula: '',
      cupoPorCorte: '', snies: '', urlSnies: '',
      mision: '', vision: '', proposito: '',
      necesidadesPais: '', areasAcademicas: '',
    };
  }

  openCreate(): void {
    this.form = this.emptyForm();
    this.dialogTab.set(0);
    this.dialogVisible = true;
  }

  openEdit(d: Denominacion): void {
    this.form = { ...d };
    this.dialogTab.set(this.activeTab());
    this.dialogVisible = true;
  }

  async save(): Promise<void> {
    if (!this.form.nombrePrograma && !this.form.mision) {
      this.msg.add({ severity: 'warn', summary: 'Atención', detail: 'Completa al menos el nombre del programa o la misión.' });
      return;
    }
    this.saving.set(true);
    try {
      const data: Denominacion = { ...this.form };
      const current = this.record();
      if (current?.key) {
        await this.fs.updateDocument<Denominacion>('denominacion', current.key, data);
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Información actualizada correctamente' });
      } else {
        await this.fs.addDocument<Denominacion>('denominacion', data as any);
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Información creada correctamente' });
      }
      this.dialogVisible = false;
    } catch (err: any) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: err.message });
    } finally {
      this.saving.set(false);
    }
  }

  splitLines(text: string | undefined): string[] {
    if (!text) return [];
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  }
}
