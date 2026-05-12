import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Evento } from '../../../core/models';

@Component({
  selector: 'app-eventos-programa', standalone: true, imports: [CommonModule, Tag],
  template: `
    <div class="page-hero"><div class="ph"><h1>Actividades del Programa</h1><p>Eventos, conferencias y seminarios</p></div></div>
    <section class="section"><div class="container">
      <div class="ev-grid">
        @for (ev of eventos(); track ev.key || $index) {
        <div class="ev-card card-usco">
          @if(ev.img){<div class="ev-img"><img [src]="ev.img" [alt]="ev.titulo"/></div>}
          <div class="ev-body">
            <p-tag [value]="ev.fechaEvento || 'Próximamente'" icon="far fa-calendar-alt" severity="secondary"/>
            <h4>{{ev.titulo}}</h4><p>{{ev.resenia}}</p>
            @if(ev.url){<a [href]="ev.url" target="_blank" class="ev-link">Leer más <i class="fas fa-arrow-right"></i></a>}
          </div>
        </div>
        }
      </div>
    </div></section>
  `,
  styles: `.page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}.ph h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}.ph p{font-size:1.1rem;opacity:.8}.ev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.5rem}.ev-card{overflow:hidden}.ev-img{height:200px;overflow:hidden}.ev-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s}.ev-card:hover .ev-img img{transform:scale(1.05)}.ev-body{padding:1.25rem}.ev-body h4{font-family:var(--font-primary);font-size:1rem;color:var(--usco-gris-dark);margin:.75rem 0 .5rem}.ev-body p{font-size:.85rem;color:var(--surface-600);line-height:1.6;margin-bottom:.75rem}.ev-link{color:var(--usco-vinotinto);font-weight:600;font-size:.88rem;display:inline-flex;align-items:center;gap:.3rem;transition:gap .2s}.ev-link:hover{gap:.6rem}`,
})
export class EventosProgramaComponent implements OnInit {
  private fs = inject(FirestoreService);
  eventos = signal<Evento[]>([]);
  ngOnInit() {
    this.fs.getCollection<Evento>('eventosPrograma').subscribe(d => this.eventos.set(d || []));
  }
}
