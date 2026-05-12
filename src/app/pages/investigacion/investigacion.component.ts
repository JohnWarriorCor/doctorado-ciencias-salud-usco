import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../core/services/firestore.service';
import { GrupoInvestigacion } from '../../core/models';

@Component({
  selector: 'app-investigacion', standalone: true, imports: [CommonModule],
  template: `
    <div class="page-hero"><div class="ph"><h1>Investigación</h1><p>Líneas y grupos de investigación del programa</p></div></div>
    <section class="section"><div class="container">
      @for (g of grupos(); track g.key || $index) {
        @if(g.fieldArray && g.fieldArray.length) {
          <div class="card-usco" style="padding:2rem;margin-bottom:1.5rem">
            <table class="inv-table">
              <thead><tr>@for(h of getHeaders(g.fieldArray[0]); track h){<th>{{h}}</th>}</tr></thead>
              <tbody>@for(row of g.fieldArray; track $index){<tr>@for(h of getHeaders(g.fieldArray[0]); track h){<td>{{row[h]}}</td>}</tr>}</tbody>
            </table>
          </div>
        }
      }
      @if(!grupos().length){<div style="text-align:center;padding:4rem;color:var(--surface-400)"><i class="fas fa-microscope" style="font-size:3rem;margin-bottom:1rem;display:block"></i><p>Cargando información...</p></div>}
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}.ph h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}.ph p{font-size:1.1rem;opacity:.8}
    .inv-table{width:100%;border-collapse:collapse;font-size:.88rem}
    .inv-table th{background:var(--usco-vinotinto);color:white;padding:.7rem 1rem;text-align:left;font-weight:600;font-size:.82rem;text-transform:uppercase}
    .inv-table td{padding:.65rem 1rem;border-bottom:1px solid var(--surface-200)}
    .inv-table tbody tr:hover{background:rgba(143,20,27,.04)}.inv-table tbody tr:nth-child(even){background:var(--surface-50)}
  `,
})
export class InvestigacionComponent implements OnInit {
  private fs = inject(FirestoreService);
  grupos = signal<GrupoInvestigacion[]>([]);
  ngOnInit() {
    this.fs.getCollection<GrupoInvestigacion>('gruposInvestigacion').subscribe(d => this.grupos.set(d || []));
  }
  getHeaders(obj: any): string[] { return obj ? Object.keys(obj).filter(k => k !== '$key' && k !== 'key' && k !== 'id' && !k.startsWith('_')) : []; }
}
