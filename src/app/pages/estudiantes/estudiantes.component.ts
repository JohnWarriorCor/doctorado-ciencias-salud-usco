import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../core/services/firestore.service';
import { Estudiante } from '../../core/models';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-hero"><div class="page-hero-content"><h1>Nuestros Estudiantes</h1><p>Estudiantes activos del Doctorado</p></div></div>
    <section class="section"><div class="container">
      <div class="est-grid">
        @for (est of estudiantes(); track est.key || $index) {
        <div class="est-card card-usco">
          <div class="est-photo">
            @if(est.foto){<img [src]="est.foto" [alt]="est.nombre"/>}
            @else {<div class="est-placeholder"><i class="fas fa-user-graduate"></i></div>}
          </div>
          <div class="est-info">
            <h4>{{est.nombre}}</h4>
            @if(est.codigo){<span class="est-code">Código: {{est.codigo}}</span>}
            <p>{{est.sintesis}}</p>
            <div class="est-links">
              @if(est.correo){<a [href]="'mailto:'+est.correo"><i class="fas fa-envelope"></i></a>}
              @if(est.cvlac){<a [href]="est.cvlac" target="_blank"><i class="fas fa-file-alt"></i></a>}
              @if(est.orcid){<a [href]="est.orcid" target="_blank"><i class="fab fa-orcid"></i></a>}
            </div>
          </div>
        </div>
        }
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}
    .page-hero h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}
    .page-hero p{font-size:1.1rem;opacity:.8}
    .est-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
    .est-card{display:flex;gap:1rem;padding:1.25rem}
    .est-photo{width:80px;height:80px;border-radius:50%;overflow:hidden;border:3px solid var(--usco-oro);flex-shrink:0}
    .est-photo img{width:100%;height:100%;object-fit:cover}
    .est-placeholder{width:100%;height:100%;background:var(--surface-200);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--surface-400)}
    .est-info h4{font-family:var(--font-primary);font-size:.95rem;color:var(--usco-gris-dark);margin-bottom:.25rem}
    .est-code{font-size:.78rem;color:var(--usco-vinotinto);font-weight:600;display:block;margin-bottom:.5rem}
    .est-info p{font-size:.84rem;line-height:1.5;color:var(--surface-600);margin-bottom:.5rem}
    .est-links{display:flex;gap:.4rem}
    .est-links a{width:30px;height:30px;border-radius:50%;background:var(--usco-vinotinto-50);color:var(--usco-vinotinto);display:flex;align-items:center;justify-content:center;font-size:.8rem;transition:all .2s}
    .est-links a:hover{background:var(--usco-vinotinto);color:white}
  `,
})
export class EstudiantesComponent implements OnInit {
  private fs = inject(FirestoreService);
  estudiantes = signal<Estudiante[]>([]);
  ngOnInit() {
    this.fs.getCollection<Estudiante>('estudiantes').subscribe(d => this.estudiantes.set((d || []).filter(e => e.estado === 1)));
  }
}
