import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../core/services/firestore.service';
import { Docente } from '../../core/models';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-hero"><div class="page-hero-content"><h1>Plantel Docente</h1><p>Profesores del Doctorado en Ciencias de la Salud</p></div></div>
    <section class="section"><div class="container">
      <div class="docentes-grid">
        @for (doc of docentes(); track doc.key || $index) {
        <div class="doc-card card-usco">
          <div class="doc-header">
            <div class="doc-avatar">
              @if(doc.foto){<img [src]="doc.foto" [alt]="doc.nombre"/>}
              @else {<div class="doc-placeholder"><i class="fas fa-user"></i></div>}
            </div>
            <h3>{{doc.nombre}}</h3>
          </div>
          <div class="doc-body">
            <p class="doc-sintesis">{{doc.sintesis}}</p>
            <div class="doc-links">
              @if(doc.correo){<a [href]="'mailto:'+doc.correo"><i class="fas fa-envelope"></i> Correo</a>}
              @if(doc.cvlac){<a [href]="doc.cvlac" target="_blank"><i class="fas fa-file-alt"></i> CvLAC</a>}
              @if(doc.orcid){<a [href]="doc.orcid" target="_blank"><i class="fab fa-orcid"></i> ORCID</a>}
            </div>
          </div>
        </div>
        }
      </div>
      @if(!docentes().length){<div class="empty"><i class="fas fa-spinner fa-spin"></i><p>Cargando docentes...</p></div>}
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}
    .page-hero h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}
    .page-hero p{font-size:1.1rem;opacity:.8}
    .docentes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.5rem}
    .doc-card{overflow:hidden}
    .doc-header{background:linear-gradient(135deg,var(--usco-vinotinto),var(--usco-vinotinto-dark));padding:1.5rem;display:flex;align-items:center;gap:1rem}
    .doc-avatar{width:70px;height:70px;border-radius:50%;overflow:hidden;border:3px solid var(--usco-oro);flex-shrink:0}
    .doc-avatar img{width:100%;height:100%;object-fit:cover}
    .doc-placeholder{width:100%;height:100%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.6);font-size:1.5rem}
    .doc-header h3{color:white;font-family:var(--font-primary);font-size:1rem;font-weight:600}
    .doc-body{padding:1.25rem}
    .doc-sintesis{font-size:.88rem;line-height:1.6;margin-bottom:1rem;color:var(--surface-600)}
    .doc-links{display:flex;flex-wrap:wrap;gap:.5rem}
    .doc-links a{display:inline-flex;align-items:center;gap:.3rem;padding:.4rem .8rem;border-radius:var(--radius-full);font-size:.8rem;font-weight:500;background:var(--usco-vinotinto-50);color:var(--usco-vinotinto);transition:all .2s}
    .doc-links a:hover{background:var(--usco-vinotinto);color:white}
    .empty{text-align:center;padding:4rem;color:var(--surface-400)}
    .empty i{font-size:2rem;margin-bottom:1rem}
  `,
})
export class DocentesComponent implements OnInit {
  private fs = inject(FirestoreService);
  docentes = signal<Docente[]>([]);
  ngOnInit() {
    this.fs.getCollection<Docente>('docentes').subscribe(d => this.docentes.set(d || []));
  }
}
