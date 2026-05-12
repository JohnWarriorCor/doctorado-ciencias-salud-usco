import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Articulo } from '../../../core/models';

@Component({
  selector: 'app-articulos-estudiantes', standalone: true, imports: [CommonModule],
  template: `
    <div class="page-hero"><div class="ph"><h1>Artículos de Estudiantes</h1><p>Producción científica estudiantil</p></div></div>
    <section class="section"><div class="container">
      @for (art of articulos(); track art.key || $index) {
      <div class="card-usco" style="padding:1.5rem;margin-bottom:1rem;display:flex;gap:1rem;align-items:flex-start">
        <div style="background:var(--usco-vinotinto);color:white;padding:.5rem 1rem;border-radius:var(--radius-sm);font-weight:700;font-size:.9rem;flex-shrink:0">{{art.anio}}</div>
        <div>
          <h4 style="font-family:var(--font-primary);font-size:1rem;color:var(--usco-gris-dark);margin-bottom:.4rem">{{art.nombreArticulo}}</h4>
          <p style="font-size:.84rem;color:var(--surface-600);margin-bottom:.3rem"><i class="fas fa-users"></i> {{art.autores}}</p>
          <p style="font-size:.84rem;color:var(--surface-600)"><i class="fas fa-journal-whills"></i> {{art.revista}}</p>
          @if(art.enlace){<a [href]="art.enlace" target="_blank" style="color:var(--usco-vinotinto);font-weight:600;font-size:.88rem;margin-top:.5rem;display:inline-flex;align-items:center;gap:.3rem"><i class="fas fa-external-link-alt"></i> Ver</a>}
        </div>
      </div>
      }
    </div></section>
  `,
  styles: `.page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}.ph h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}.ph p{font-size:1.1rem;opacity:.8}`,
})
export class ArticulosEstudiantesComponent implements OnInit {
  private fs = inject(FirestoreService);
  articulos = signal<Articulo[]>([]);
  ngOnInit() {
    this.fs.getCollection<Articulo>('articulosEstudiantes').subscribe(d => this.articulos.set(d || []));
  }
}
