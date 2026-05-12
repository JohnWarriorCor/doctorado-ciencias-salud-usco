import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Egresado } from '../../../core/models';

@Component({
  selector: 'app-egresados', standalone: true, imports: [CommonModule],
  template: `
    <div class="page-hero"><div class="ph"><h1>Egresados</h1><p>Doctores graduados del programa</p></div></div>
    <section class="section"><div class="container">
      <div class="egr-grid">
        @for (e of egresados(); track e.key || $index) {
        <div class="egr-card card-usco" style="display:flex;gap:1rem;padding:1.25rem">
          <div class="egr-photo">@if(e.foto){<img [src]="e.foto" [alt]="e.nombre"/>}@else{<div class="egr-ph"><i class="fas fa-user-graduate"></i></div>}</div>
          <div>
            <h4 style="font-family:var(--font-primary);font-size:.95rem;color:var(--usco-gris-dark);margin-bottom:.25rem">{{e.nombre}}</h4>
            <p style="font-size:.84rem;line-height:1.5;color:var(--surface-600)">{{e.sintesis}}</p>
            <div style="display:flex;gap:.4rem;margin-top:.5rem">
              @if(e.correo){<a [href]="'mailto:'+e.correo" class="egr-link"><i class="fas fa-envelope"></i></a>}
              @if(e.cvlac){<a [href]="e.cvlac" target="_blank" class="egr-link"><i class="fas fa-file-alt"></i></a>}
              @if(e.orcid){<a [href]="e.orcid" target="_blank" class="egr-link"><i class="fab fa-orcid"></i></a>}
            </div>
          </div>
        </div>
        }
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}.ph h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}.ph p{font-size:1.1rem;opacity:.8}
    .egr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.5rem}
    .egr-photo{width:70px;height:70px;border-radius:50%;overflow:hidden;border:3px solid var(--usco-oro);flex-shrink:0}
    .egr-photo img{width:100%;height:100%;object-fit:cover}
    .egr-ph{width:100%;height:100%;background:var(--surface-200);display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:var(--surface-400)}
    .egr-link{width:28px;height:28px;border-radius:50%;background:rgba(143,20,27,.08);color:var(--usco-vinotinto);display:flex;align-items:center;justify-content:center;font-size:.78rem;transition:all .2s}
    .egr-link:hover{background:var(--usco-vinotinto);color:white}
  `,
})
export class EgresadosComponent implements OnInit {
  private fs = inject(FirestoreService);
  egresados = signal<Egresado[]>([]);
  ngOnInit() {
    this.fs.getCollection<Egresado>('egresados').subscribe(d => this.egresados.set(d || []));
  }
}
