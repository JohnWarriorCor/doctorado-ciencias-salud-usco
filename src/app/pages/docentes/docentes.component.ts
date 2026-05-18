import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../../core/services/firestore.service';
import { Docente } from '../../core/models';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-hero">
      <div class="page-hero-overlay"></div>
      <div class="page-hero-content">
        <h1><i class="fas fa-chalkboard-teacher"></i> Plantel Docente</h1>
        <p>Profesores del Doctorado en Ciencias de la Salud – USCO</p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        @if(docentes().length === 0){
          <div class="empty-state">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Cargando docentes...</p>
          </div>
        }
        <div class="docentes-grid">
          @for (doc of docentes(); track doc.key || $index) {
            <div class="doc-card" (click)="verPerfil(doc)" tabindex="0"
                 (keydown.enter)="verPerfil(doc)" role="button" [attr.aria-label]="'Ver perfil de '+doc.nombre">
              <!-- Header vinotinto -->
              <div class="doc-header">
                <div class="doc-avatar">
                  @if(doc.foto){<img [src]="doc.foto" [alt]="doc.nombre"/>}
                  @else{<div class="doc-placeholder"><i class="fas fa-user"></i></div>}
                </div>
                <div class="doc-header-info">
                  <h3>{{ doc.nombre }}</h3>
                  @if(doc.cargo){<span class="doc-cargo">{{ doc.cargo }}</span>}
                  @if(doc.dedicacion){<span class="doc-badge">{{ doc.dedicacion }}</span>}
                </div>
              </div>

              <!-- Body -->
              <div class="doc-body">
                @if(doc.sintesis){
                  <p class="doc-sintesis">{{ doc.sintesis | slice:0:160 }}{{ doc.sintesis.length > 160 ? '…' : '' }}</p>
                }
                @if(doc.grupoInvestigacion){
                  <div class="doc-grupo">
                    <i class="fas fa-users"></i>
                    {{ doc.grupoInvestigacion }}
                  </div>
                }
                <div class="doc-links">
                  @if(doc.correo){<span class="doc-chip"><i class="fas fa-envelope"></i> {{ doc.correo }}</span>}
                  @if(doc.cvlac){<span class="doc-chip chip-cvlac"><i class="fas fa-file-alt"></i> CvLAC</span>}
                  @if(doc.orcid){<span class="doc-chip chip-orcid"><i class="fab fa-orcid"></i> ORCID</span>}
                </div>
              </div>

              <!-- Footer CTA -->
              <div class="doc-footer">
                <span class="doc-cta">Ver perfil completo <i class="fas fa-arrow-right"></i></span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    /* HERO */
    .page-hero{position:relative;background:linear-gradient(135deg,#1e262b 0%,#3a1518 40%,#8f141b 75%,#5c0e12 100%);padding:5rem 1.5rem 3.5rem;text-align:center;overflow:hidden}
    .page-hero-overlay{position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r=".8" fill="rgba(255,255,255,0.04)"/></pattern></defs><rect fill="url(%23g)" width="100" height="100"/></svg>')}
    .page-hero-content{position:relative;z-index:2}
    .page-hero h1{font-size:clamp(2rem,4vw,2.8rem);margin-bottom:.75rem;color:white;display:flex;align-items:center;justify-content:center;gap:.7rem}
    .page-hero h1 i{font-size:clamp(1.5rem,3vw,2.2rem);opacity:.85}
    .page-hero p{font-size:1.1rem;opacity:.8;color:rgba(255,255,255,.85)}

    /* GRID */
    .docentes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.5rem}
    .empty-state{text-align:center;padding:4rem;color:var(--surface-400);display:flex;flex-direction:column;align-items:center;gap:.75rem}
    .empty-state i{font-size:2.5rem;color:var(--usco-vinotinto)}

    /* CARD */
    .doc-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1px solid var(--surface-150,#ebebeb);display:flex;flex-direction:column;cursor:pointer;transition:transform .25s,box-shadow .25s;outline:none}
    .doc-card:hover,.doc-card:focus-visible{transform:translateY(-5px);box-shadow:0 12px 36px rgba(143,20,27,.15)}
    .doc-card:focus-visible{outline:2px solid var(--usco-vinotinto)}

    /* HEADER */
    .doc-header{background:linear-gradient(135deg,var(--usco-vinotinto) 0%,var(--usco-vinotinto-dark,#5c0e12) 100%);padding:1.4rem 1.25rem;display:flex;align-items:center;gap:1rem}
    .doc-avatar{width:72px;height:72px;border-radius:50%;overflow:hidden;border:3px solid rgba(255,255,255,.35);flex-shrink:0;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center}
    .doc-avatar img{width:100%;height:100%;object-fit:cover}
    .doc-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.5);font-size:1.8rem}
    .doc-header-info{flex:1;min-width:0}
    .doc-header-info h3{color:#fff;font-size:.97rem;font-weight:700;margin:0 0 .3rem;font-family:var(--font-primary);line-height:1.3}
    .doc-cargo{display:block;font-size:.78rem;color:rgba(255,255,255,.75);margin-bottom:.2rem}
    .doc-badge{display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.25);color:#fff;padding:.15rem .65rem;border-radius:12px;font-size:.72rem;font-weight:600}

    /* BODY */
    .doc-body{padding:1.2rem 1.25rem;flex:1;display:flex;flex-direction:column;gap:.75rem}
    .doc-sintesis{font-size:.86rem;line-height:1.6;color:var(--surface-600);margin:0}
    .doc-grupo{display:flex;align-items:center;gap:.5rem;font-size:.82rem;color:var(--surface-500);font-style:italic}
    .doc-grupo i{color:var(--usco-vinotinto);font-size:.8rem}
    .doc-links{display:flex;flex-wrap:wrap;gap:.4rem}
    .doc-chip{display:inline-flex;align-items:center;gap:.3rem;padding:.3rem .7rem;border-radius:20px;font-size:.75rem;font-weight:500;background:var(--surface-100);color:var(--surface-600)}
    .chip-cvlac{background:#fce4ec;color:#8f141b}
    .chip-orcid{background:#e8f5e9;color:#2e7d32}

    /* FOOTER */
    .doc-footer{border-top:1px solid var(--surface-100);padding:.85rem 1.25rem;display:flex;justify-content:flex-end}
    .doc-cta{display:inline-flex;align-items:center;gap:.4rem;font-size:.83rem;font-weight:700;color:var(--usco-vinotinto);transition:gap .15s}
    .doc-card:hover .doc-cta{gap:.65rem}

    @media(max-width:576px){.docentes-grid{grid-template-columns:1fr}}
  `,
})
export class DocentesComponent implements OnInit {
  private fs     = inject(FirestoreService);
  private router = inject(Router);

  docentes = signal<Docente[]>([]);

  ngOnInit(): void {
    this.fs.getCollection<Docente>('docentes').subscribe(d => this.docentes.set(d || []));
  }

  verPerfil(doc: Docente): void {
    if (doc.key) this.router.navigate(['/docentes', doc.key]);
  }
}
