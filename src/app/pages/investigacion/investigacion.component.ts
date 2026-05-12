import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';
import { GrupoInvestigacion } from '../../core/models';

@Component({
  selector: 'app-investigacion', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <div class="page-hero"><div class="ph"><h1>Investigación</h1><p>Líneas y grupos de investigación del programa</p></div></div>
    <section class="section"><div class="container">
      <div class="card-usco" style="padding:2rem">
        <h2 class="section-title"><i class="fas fa-microscope"></i> Grupos de Investigación del Doctorado</h2>

        <!-- Search -->
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input [(ngModel)]="searchTerm" (input)="filterGroups()" placeholder="Buscar por Nombre del Grupo o Líder" class="search-input"/>
          <button class="btn-search" (click)="filterGroups()"><i class="fas fa-search"></i> Buscar</button>
        </div>

        <div class="table-responsive">
          <table class="inv-table">
            <thead>
              <tr>
                <th style="width:50px">N°</th>
                <th>Código de Grupo Colciencias</th>
                <th>Nombre del Grupo</th>
                <th>Líder del Grupo</th>
                <th>Clasificación del Grupo</th>
                <th style="width:80px">GrupLAC</th>
              </tr>
            </thead>
            <tbody>
              @for (g of filteredGrupos(); track g.key || $index) {
                <tr>
                  <td style="text-align:center;font-weight:600">{{$index + 1}}</td>
                  <td><code class="code-badge">{{g.codigoColciencias}}</code></td>
                  <td><strong>{{g.nombreGrupo}}</strong></td>
                  <td>{{g.liderGrupo}}</td>
                  <td><span class="clasif-badge" [class]="'clasif-badge clasif-' + (g.clasificacion || '').replace(' ','')">{{g.clasificacion}}</span></td>
                  <td style="text-align:center">
                    @if(g.grupLAC) {
                      <a [href]="g.grupLAC" target="_blank" class="link-gruplac" title="Ver en GrupLAC"><i class="fas fa-external-link-alt"></i></a>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if(!grupos().length){
          <div style="text-align:center;padding:4rem;color:var(--surface-400)">
            <i class="fas fa-microscope" style="font-size:3rem;margin-bottom:1rem;display:block"></i>
            <p>Cargando información...</p>
          </div>
        }
        @if(grupos().length && !filteredGrupos().length){
          <div style="text-align:center;padding:2rem;color:var(--surface-400)">
            <p>No se encontraron resultados para "{{searchTerm}}"</p>
          </div>
        }
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}.ph h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}.ph p{font-size:1.1rem;opacity:.8}

    .section-title{font-size:1.3rem;color:var(--usco-vinotinto);margin-bottom:1.5rem;display:flex;align-items:center;gap:.5rem;font-weight:700}

    .search-bar{display:flex;align-items:center;gap:.6rem;border:2px solid var(--surface-200);border-radius:8px;padding:.5rem 1rem;margin-bottom:1.5rem;transition:border-color .3s}
    .search-bar:focus-within{border-color:var(--usco-vinotinto)}
    .search-bar i{color:var(--surface-400)}
    .search-input{border:none;background:transparent;outline:none;flex:1;font-size:.9rem;color:var(--surface-700);padding:.3rem 0}
    .btn-search{background:var(--usco-vinotinto);color:white;border:none;padding:.45rem 1rem;border-radius:6px;font-size:.85rem;cursor:pointer;display:flex;align-items:center;gap:.4rem;font-weight:600;transition:background .2s}
    .btn-search:hover{background:#5c0e12}

    .table-responsive{overflow-x:auto}
    .inv-table{width:100%;border-collapse:collapse;font-size:.88rem}
    .inv-table th{background:var(--usco-vinotinto);color:white;padding:.7rem 1rem;text-align:left;font-weight:600;font-size:.82rem;text-transform:uppercase}
    .inv-table td{padding:.65rem 1rem;border-bottom:1px solid var(--surface-200)}
    .inv-table tbody tr:hover{background:rgba(143,20,27,.04)}.inv-table tbody tr:nth-child(even){background:var(--surface-50)}

    .code-badge{background:var(--surface-100);color:var(--usco-vinotinto);padding:.2rem .5rem;border-radius:4px;font-size:.82rem;font-weight:600}
    .clasif-badge{display:inline-block;padding:.2rem .6rem;border-radius:12px;font-size:.8rem;font-weight:700;background:var(--surface-100);color:var(--surface-700)}
    .clasif-A1{background:#e8f5e9;color:#2e7d32}.clasif-A{background:#e3f2fd;color:#1565c0}.clasif-B{background:#fff3e0;color:#e65100}.clasif-C{background:#fce4ec;color:#c62828}

    .link-gruplac{color:var(--usco-vinotinto);font-size:1.1rem;transition:color .2s}
    .link-gruplac:hover{color:#5c0e12}
  `,
})
export class InvestigacionComponent implements OnInit {
  private fs = inject(FirestoreService);
  grupos = signal<GrupoInvestigacion[]>([]);
  filteredGrupos = signal<GrupoInvestigacion[]>([]);
  searchTerm = '';

  ngOnInit() {
    this.fs.getCollection<GrupoInvestigacion>('gruposInvestigacion').subscribe(d => {
      this.grupos.set(d || []);
      this.filterGroups();
    });
  }

  filterGroups() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredGrupos.set(this.grupos());
      return;
    }
    this.filteredGrupos.set(
      this.grupos().filter(g =>
        (g.nombreGrupo || '').toLowerCase().includes(term) ||
        (g.liderGrupo || '').toLowerCase().includes(term) ||
        (g.codigoColciencias || '').toLowerCase().includes(term)
      )
    );
  }
}
