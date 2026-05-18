import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Docente } from '../../../core/models';

@Component({
  selector: 'app-docente-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (loading()) {
      <div class="dp-loading">
        <div class="dp-spinner"><i class="fas fa-circle-notch fa-spin"></i></div>
        <p>Cargando perfil...</p>
      </div>
    }

    @if (!loading() && !docente()) {
      <div class="dp-notfound">
        <i class="fas fa-user-slash"></i>
        <h2>Docente no encontrado</h2>
        <a routerLink="/docentes" class="dp-back-btn"><i class="fas fa-arrow-left"></i> Volver al listado</a>
      </div>
    }

    @if (docente(); as d) {
      <!-- HERO -->
      <div class="dp-hero">
        <div class="dp-hero-overlay"></div>
        <div class="dp-hero-content">
          <a routerLink="/docentes" class="dp-breadcrumb">
            <i class="fas fa-arrow-left"></i> Plantel Docente
          </a>
          <div class="dp-hero-avatar">
            @if(d.foto){<img [src]="d.foto" [alt]="d.nombre"/>}
            @else{<i class="fas fa-user"></i>}
          </div>
          <h1>{{ d.nombre }}</h1>
          @if(d.cargo){<p class="dp-hero-cargo">{{ d.cargo }}</p>}
          @if(d.dedicacion){<span class="dp-hero-badge">{{ d.dedicacion }}</span>}
        </div>
      </div>

      <!-- BODY -->
      <div class="dp-body">
        <div class="dp-layout">

          <!-- SIDEBAR -->
          <aside class="dp-sidebar">
            <div class="dp-sidebar-card">
              <!-- Contact -->
              <div class="dp-sidebar-section">
                <h4><i class="fas fa-address-card"></i> Contacto</h4>
                @if(d.correo){
                  <a [href]="'mailto:'+d.correo" class="dp-contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>{{ d.correo }}</span>
                  </a>
                }
                @if(d.grupoInvestigacion){
                  <div class="dp-contact-item">
                    <i class="fas fa-users"></i>
                    <span>{{ d.grupoInvestigacion }}</span>
                  </div>
                }
              </div>

              <!-- Links académicos -->
              <div class="dp-sidebar-section">
                <h4><i class="fas fa-link"></i> Perfiles Académicos</h4>
                <div class="dp-academic-links">
                  @if(d.cvlac){
                    <a [href]="d.cvlac" target="_blank" rel="noopener" class="dp-acad-btn cvlac-btn">
                      <i class="fas fa-file-alt"></i> CvLAC
                    </a>
                  }
                  @if(d.orcid){
                    <a [href]="d.orcid" target="_blank" rel="noopener" class="dp-acad-btn orcid-btn">
                      <i class="fab fa-orcid"></i> ORCID
                    </a>
                  }
                  @if(d.transparencia){
                    <a [href]="d.transparencia" target="_blank" rel="noopener" class="dp-acad-btn transp-btn">
                      <i class="fas fa-balance-scale"></i> Ley de Transparencia
                    </a>
                  }
                </div>
              </div>

              <!-- Líneas de investigación -->
              @if(d.lineasInvestigacion){
                <div class="dp-sidebar-section">
                  <h4><i class="fas fa-flask"></i> Líneas de Investigación</h4>
                  <ul class="dp-lineas">
                    @for(l of splitLines(d.lineasInvestigacion); track l){
                      <li>{{ l }}</li>
                    }
                  </ul>
                </div>
              }
            </div>
          </aside>

          <!-- MAIN CONTENT -->
          <main class="dp-main">
            <!-- Tabs -->
            <div class="dp-tabs">
              <button class="dp-tab" [class.active]="tab()===0" (click)="tab.set(0)">
                <i class="fas fa-user"></i> Perfil Profesional
              </button>
              @if(d.fieldArray.length){
                <button class="dp-tab" [class.active]="tab()===1" (click)="tab.set(1)">
                  <i class="fas fa-graduation-cap"></i> Logros Académicos
                </button>
              }
              @if(d.fieldArrayArticulos.length){
                <button class="dp-tab" [class.active]="tab()===2" (click)="tab.set(2)">
                  <i class="fas fa-newspaper"></i> Artículos
                </button>
              }
            </div>

            <!-- TAB 0: Perfil -->
            @if(tab()===0){
              <div class="dp-panel animate-in">
                <div class="dp-profile-block">
                  <div class="dp-profile-header">
                    <div class="dp-profile-icon"><i class="fas fa-user-tie"></i></div>
                    <h2>Perfil Profesional</h2>
                  </div>
                  <p class="dp-sintesis">{{ d.sintesis || 'Sin información registrada.' }}</p>
                </div>
              </div>
            }

            <!-- TAB 1: Logros Académicos -->
            @if(tab()===1){
              <div class="dp-panel animate-in">
                <div class="dp-logros-list">
                  @for(logro of d.fieldArray; track $index){
                    <div class="dp-logro-item">
                      <div class="dp-logro-dot"><i class="fas fa-award"></i></div>
                      <div class="dp-logro-content">
                        @if(logro.titulo){<strong class="dp-logro-titulo">{{ logro.titulo }}</strong>}
                        @if(logro.institucion){<span class="dp-logro-inst"><i class="fas fa-university"></i> {{ logro.institucion }}</span>}
                        @if(logro.anio){<span class="dp-logro-year">{{ logro.anio }}</span>}
                        @if(logro.descripcion){<p class="dp-logro-desc">{{ logro.descripcion }}</p>}
                      </div>
                    </div>
                  }
                  @if(!d.fieldArray.length){
                    <p class="dp-empty">Sin logros académicos registrados.</p>
                  }
                </div>
              </div>
            }

            <!-- TAB 2: Artículos -->
            @if(tab()===2){
              <div class="dp-panel animate-in">
                <div class="dp-articulos-list">
                  @for(art of d.fieldArrayArticulos; track $index){
                    <div class="dp-articulo-card">
                      <div class="dp-art-num">{{ $index + 1 }}</div>
                      <div class="dp-art-content">
                        @if(art.nombreArticulo){<strong class="dp-art-titulo">{{ art.nombreArticulo }}</strong>}
                        @if(art.revista){<span class="dp-art-revista"><i class="fas fa-book-open"></i> {{ art.revista }}</span>}
                        @if(art.autores){<span class="dp-art-autores"><i class="fas fa-users"></i> {{ art.autores }}</span>}
                        @if(art.anio){<span class="dp-art-year dp-badge">{{ art.anio }}</span>}
                        @if(art.resumen){<p class="dp-art-resumen">{{ art.resumen }}</p>}
                        @if(art.enlace){
                          <a [href]="art.enlace" target="_blank" rel="noopener" class="dp-art-link">
                            <i class="fas fa-external-link-alt"></i> Ver artículo
                          </a>
                        }
                      </div>
                    </div>
                  }
                  @if(!d.fieldArrayArticulos.length){
                    <p class="dp-empty">Sin artículos registrados.</p>
                  }
                </div>
              </div>
            }
          </main>
        </div>
      </div>
    }
  `,
  styles: `
    /* LOADING / NOT FOUND */
    .dp-loading,.dp-notfound{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:1.25rem;color:var(--surface-400)}
    .dp-spinner{font-size:2.5rem;color:var(--usco-vinotinto)}
    .dp-notfound i{font-size:4rem;color:var(--surface-300)}
    .dp-notfound h2{color:var(--surface-500)}
    .dp-back-btn{display:inline-flex;align-items:center;gap:.45rem;padding:.65rem 1.4rem;background:var(--usco-vinotinto);color:#fff;border-radius:var(--radius-full);font-weight:600;font-size:.9rem;transition:background .2s}
    .dp-back-btn:hover{background:#5c0e12}

    /* HERO */
    .dp-hero{background:linear-gradient(135deg,#1e262b 0%,#8f141b 60%,#5c0e12 100%);padding:3rem 1.5rem 4rem;text-align:center;position:relative;overflow:hidden}
    .dp-hero-overlay{position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r=".8" fill="rgba(255,255,255,0.04)"/></pattern></defs><rect fill="url(%23g)" width="100" height="100"/></svg>')}
    .dp-breadcrumb{position:relative;z-index:2;display:inline-flex;align-items:center;gap:.4rem;color:rgba(255,255,255,.65);font-size:.88rem;font-weight:500;margin-bottom:1.75rem;transition:color .2s}
    .dp-breadcrumb:hover{color:rgba(255,255,255,.95)}
    .dp-hero-content{position:relative;z-index:2;max-width:640px;margin:0 auto}
    .dp-hero-avatar{width:110px;height:110px;border-radius:50%;overflow:hidden;border:4px solid rgba(255,255,255,.3);margin:0 auto 1.25rem;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:3rem;color:rgba(255,255,255,.5)}
    .dp-hero-avatar img{width:100%;height:100%;object-fit:cover}
    .dp-hero h1{color:#fff;font-size:clamp(1.6rem,3vw,2.2rem);margin:0 0 .5rem;font-family:var(--font-primary)}
    .dp-hero-cargo{color:rgba(255,255,255,.75);font-size:.98rem;margin:.3rem 0}
    .dp-hero-badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);color:#fff;padding:.3rem 1rem;border-radius:20px;font-size:.82rem;font-weight:600;margin-top:.5rem}

    /* BODY / LAYOUT */
    .dp-body{background:var(--surface-50);min-height:60vh}
    .dp-layout{max-width:1100px;margin:0 auto;padding:2rem 1.5rem;display:grid;grid-template-columns:300px 1fr;gap:2rem;align-items:start}

    /* SIDEBAR */
    .dp-sidebar-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.06);border:1px solid var(--surface-200);position:sticky;top:90px}
    .dp-sidebar-section{padding:1.25rem 1.5rem;border-bottom:1px solid var(--surface-100)}
    .dp-sidebar-section:last-child{border-bottom:none}
    .dp-sidebar-section h4{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--usco-vinotinto);margin:0 0 .85rem;display:flex;align-items:center;gap:.4rem}
    .dp-contact-item{display:flex;align-items:flex-start;gap:.6rem;font-size:.85rem;color:var(--surface-700);margin-bottom:.6rem;text-decoration:none;transition:color .2s}
    .dp-contact-item:hover{color:var(--usco-vinotinto)}
    .dp-contact-item i{color:var(--usco-vinotinto);flex-shrink:0;margin-top:.15rem;font-size:.9rem}
    .dp-academic-links{display:flex;flex-direction:column;gap:.5rem}
    .dp-acad-btn{display:flex;align-items:center;gap:.5rem;padding:.55rem 1rem;border-radius:8px;font-size:.85rem;font-weight:600;text-decoration:none;transition:all .2s}
    .cvlac-btn{background:#fce4ec;color:#8f141b}.cvlac-btn:hover{background:#8f141b;color:#fff}
    .orcid-btn{background:#e8f5e9;color:#2e7d32}.orcid-btn:hover{background:#2e7d32;color:#fff}
    .transp-btn{background:#e3f2fd;color:#1565c0;font-size:.8rem}.transp-btn:hover{background:#1565c0;color:#fff}
    .dp-lineas{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.4rem}
    .dp-lineas li{font-size:.84rem;color:var(--surface-600);padding:.35rem 0;border-bottom:1px solid var(--surface-50);display:flex;align-items:flex-start;gap:.4rem}
    .dp-lineas li::before{content:'▸';color:var(--usco-vinotinto);flex-shrink:0;font-size:.75rem;margin-top:.1rem}
    .dp-lineas li:last-child{border-bottom:none}

    /* MAIN / TABS */
    .dp-main{min-width:0}
    .dp-tabs{display:flex;gap:.4rem;background:#fff;border-radius:12px;padding:.35rem;margin-bottom:1.5rem;box-shadow:0 2px 10px rgba(0,0,0,.05);border:1px solid var(--surface-100);flex-wrap:wrap}
    .dp-tab{flex:1;min-width:fit-content;padding:.6rem 1rem;border:none;border-radius:8px;background:transparent;cursor:pointer;font-weight:600;font-size:.84rem;color:var(--surface-500);transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.4rem;white-space:nowrap}
    .dp-tab.active{background:var(--usco-vinotinto);color:#fff;box-shadow:0 3px 10px rgba(143,20,27,.3)}
    .dp-tab:hover:not(.active){background:var(--surface-50);color:var(--usco-vinotinto)}

    /* PANELS */
    .dp-panel{background:#fff;border-radius:16px;padding:2rem;box-shadow:0 2px 16px rgba(0,0,0,.05);border:1px solid var(--surface-100);animation:fadeIn .3s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .animate-in{animation:fadeIn .3s ease}

    /* TAB PERFIL */
    .dp-profile-header{display:flex;align-items:center;gap:.85rem;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:2px solid var(--surface-100)}
    .dp-profile-icon{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#8f141b,#5c0e12);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.2rem;flex-shrink:0}
    .dp-profile-header h2{font-size:1.2rem;color:var(--usco-gris-dark);margin:0;font-family:var(--font-primary)}
    .dp-sintesis{color:var(--surface-600);line-height:1.85;font-size:.95rem;margin:0;text-align:justify}

    /* TAB LOGROS */
    .dp-logros-list{display:flex;flex-direction:column;gap:1.25rem}
    .dp-logro-item{display:flex;gap:1.25rem}
    .dp-logro-dot{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#8f141b,#5c0e12);display:flex;align-items:center;justify-content:center;color:#fff;font-size:.85rem;flex-shrink:0;margin-top:.2rem}
    .dp-logro-content{flex:1;padding-bottom:1.25rem;border-bottom:1px solid var(--surface-100)}
    .dp-logro-item:last-child .dp-logro-content{border-bottom:none}
    .dp-logro-titulo{display:block;font-size:.97rem;font-weight:700;color:var(--usco-gris-dark);margin-bottom:.4rem}
    .dp-logro-inst{display:flex;align-items:center;gap:.35rem;font-size:.84rem;color:var(--surface-500);margin-bottom:.25rem}
    .dp-logro-inst i{color:var(--usco-vinotinto);font-size:.8rem}
    .dp-logro-year{display:inline-block;background:#fce4ec;color:#8f141b;padding:.15rem .6rem;border-radius:4px;font-size:.78rem;font-weight:700;margin-bottom:.4rem}
    .dp-logro-desc{font-size:.86rem;color:var(--surface-600);line-height:1.6;margin:.4rem 0 0}

    /* TAB ARTÍCULOS */
    .dp-articulos-list{display:flex;flex-direction:column;gap:1rem}
    .dp-articulo-card{display:flex;gap:1rem;padding:1.25rem;background:var(--surface-50);border-radius:12px;border-left:3px solid var(--usco-vinotinto);transition:box-shadow .2s}
    .dp-articulo-card:hover{box-shadow:0 4px 14px rgba(143,20,27,.1)}
    .dp-art-num{width:34px;height:34px;border-radius:50%;background:var(--usco-vinotinto);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0}
    .dp-art-content{flex:1;display:flex;flex-direction:column;gap:.3rem}
    .dp-art-titulo{font-size:.93rem;font-weight:700;color:var(--usco-gris-dark);line-height:1.4}
    .dp-art-revista,.dp-art-autores{display:flex;align-items:center;gap:.35rem;font-size:.82rem;color:var(--surface-500)}
    .dp-art-revista i,.dp-art-autores i{color:var(--usco-vinotinto);font-size:.75rem}
    .dp-badge{display:inline-block;background:#fce4ec;color:#8f141b;padding:.15rem .6rem;border-radius:4px;font-size:.78rem;font-weight:700}
    .dp-art-resumen{font-size:.84rem;color:var(--surface-600);line-height:1.6;margin:.25rem 0 0}
    .dp-art-link{display:inline-flex;align-items:center;gap:.35rem;color:var(--usco-vinotinto);font-size:.83rem;font-weight:600;margin-top:.25rem;text-decoration:none;transition:gap .15s}
    .dp-art-link:hover{gap:.55rem;text-decoration:underline}
    .dp-empty{color:var(--surface-400);text-align:center;padding:2rem;font-size:.92rem}

    @media(max-width:768px){
      .dp-layout{grid-template-columns:1fr}
      .dp-sidebar-card{position:static}
      .dp-hero{padding:2rem 1rem 3rem}
    }
  `,
})
export class DocentePerfilComponent implements OnInit {
  private fs     = inject(FirestoreService);
  private route  = inject(ActivatedRoute);

  docente = signal<Docente | null>(null);
  loading = signal(true);
  tab     = signal(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.fs.getCollection<Docente>('docentes').subscribe(lista => {
      this.loading.set(false);
      const found = lista.find(d => d.key === id) ?? null;
      this.docente.set(found);
    });
  }

  splitLines(text: string | undefined): string[] {
    if (!text) return [];
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  }
}
