import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';

export interface LibroItem {
  titulo: string;
  autor: string;
  editorial: string;
  ejemplares: number;
  anio?: string;
  isbn?: string;
  descripcion?: string;
  key?: string;
}

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero -->
    <div class="page-hero">
      <div class="ph-content">
        <div class="ph-icon"><i class="fas fa-book-open"></i></div>
        <h1>Biblioteca Doctorado</h1>
        <p class="ph-desc">Libros y publicaciones disponibles en la Oficina del Doctorado en Ciencias de la Salud</p>
      </div>
    </div>

    <section class="section">
      <div class="container">

        <!-- Intro -->
        <div class="intro-card card-usco">
          <p>
            La siguiente lista incluye los libros que se encuentran en la Oficina del Doctorado en Ciencias de la Salud y
            que usted puede consultar o solicitar en préstamo dirigiéndose a la biblioteca de la Facultad de Salud de la
            Universidad Surcolombiana.
          </p>
          <p style="margin-top:.75rem">
            Si desea acceder a la Biblioteca Virtual de la Universidad Surcolombiana y a las respectivas Bases de Datos,
            debe dar clic en el siguiente enlace:
            <a href="https://biblioteca.usco.edu.co/home" target="_blank" class="link-usco">
              <i class="fas fa-external-link-alt"></i> Bases de datos Biblioteca USCO
            </a>
          </p>
        </div>

        <!-- Búsqueda -->
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input [(ngModel)]="searchTerm" (input)="filterLibros()" placeholder="Digite palabras claves para buscar..." class="search-input"/>
          <button class="btn-search" (click)="filterLibros()"><i class="fas fa-search"></i> Buscar</button>
        </div>

        <!-- Estado de carga -->
        @if (loading()) {
          <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i> Cargando biblioteca...
          </div>
        } @else if (filteredLibros().length === 0) {
          <div class="empty-state">
            <i class="fas fa-book"></i>
            <p>{{ searchTerm ? 'No se encontraron resultados para "' + searchTerm + '"' : 'No hay libros registrados aún.' }}</p>
            @if(searchTerm){<button class="btn-clear" (click)="clearSearch()">Limpiar búsqueda</button>}
          </div>
        } @else {
          <!-- Tabla de libros -->
          <div class="table-wrapper card-usco">
            <div class="table-header-info">
              <span class="result-count"><i class="fas fa-list"></i> {{filteredLibros().length}} libro(s) encontrado(s)</span>
            </div>
            <table class="lib-table">
              <thead>
                <tr>
                  <th style="width:50px">N°</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Editorial</th>
                  <th style="width:90px;text-align:center">Año</th>
                  <th style="width:100px;text-align:center">Ejemplares</th>
                </tr>
              </thead>
              <tbody>
                @for (libro of filteredLibros(); track libro.key || $index; let i = $index) {
                  <tr>
                    <td class="num-col">{{i + 1}}</td>
                    <td class="title-col">
                      <strong>{{libro.titulo}}</strong>
                      @if(libro.isbn){<div class="isbn-tag">ISBN: {{libro.isbn}}</div>}
                      @if(libro.descripcion){<div class="desc-tag">{{libro.descripcion}}</div>}
                    </td>
                    <td>{{libro.autor}}</td>
                    <td class="editorial-col">
                      @for(ed of splitEditoriales(libro.editorial); track $index){
                        <span class="ed-item">• {{ed}}</span>
                      }
                    </td>
                    <td style="text-align:center;color:var(--surface-500);font-size:.88rem">{{libro.anio || '—'}}</td>
                    <td style="text-align:center">
                      <span class="ejemplares-badge">{{libro.ejemplares}}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

      </div>
    </section>
  `,
  styles: `
    /* Hero */
    .page-hero{background:linear-gradient(135deg,#1e262b 0%,#8f141b 100%);padding:5rem 1.5rem 3.5rem;text-align:center;color:white;position:relative;overflow:hidden}
    .page-hero::before{content:'';position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="50" fill="rgba(255,255,255,.03)"/><circle cx="80" cy="80" r="40" fill="rgba(255,255,255,.02)"/></svg>') center/cover}
    .ph-content{position:relative;z-index:1}
    .ph-icon{font-size:2.5rem;margin-bottom:1rem;opacity:.8}
    .ph-content h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;margin-bottom:.75rem;color:white}
    .ph-desc{font-size:1.05rem;opacity:.8;max-width:620px;margin:0 auto}

    /* Sección */
    .section{padding:2.5rem 0 4rem}
    .container{max-width:1100px;margin:0 auto;padding:0 1.5rem}

    /* Intro */
    .intro-card{padding:1.5rem 2rem;margin-bottom:2rem;font-size:.95rem;line-height:1.7;color:var(--surface-700)}
    .link-usco{color:var(--usco-vinotinto);font-weight:600;display:inline-flex;align-items:center;gap:.3rem;transition:opacity .2s}
    .link-usco:hover{opacity:.75}

    /* Búsqueda */
    .search-bar{display:flex;align-items:center;gap:.5rem;border:1.5px solid var(--surface-300);border-radius:8px;padding:.55rem .55rem .55rem 1rem;margin-bottom:2rem;background:white;box-shadow:0 1px 4px rgba(0,0,0,.06)}
    .search-bar i{color:var(--surface-400)}
    .search-input{flex:1;border:none;outline:none;font-size:.95rem;color:var(--surface-700);background:transparent}
    .btn-search{background:var(--usco-vinotinto);color:white;border:none;border-radius:6px;padding:.5rem 1.1rem;cursor:pointer;font-size:.88rem;font-weight:600;display:flex;align-items:center;gap:.4rem;transition:background .2s}
    .btn-search:hover{background:#5c0e12}

    /* Estados */
    .loading-state,.empty-state{text-align:center;padding:4rem 1rem;color:var(--surface-400)}
    .loading-state i,.empty-state i{font-size:2rem;display:block;margin-bottom:.75rem}
    .empty-state p{font-size:.95rem;margin-bottom:1rem}
    .btn-clear{background:transparent;border:1px solid var(--surface-300);color:var(--surface-600);padding:.45rem 1rem;border-radius:6px;cursor:pointer;font-size:.88rem;transition:all .2s}
    .btn-clear:hover{border-color:var(--usco-vinotinto);color:var(--usco-vinotinto)}

    /* Tabla */
    .table-wrapper{padding:0;overflow:hidden}
    .table-header-info{padding:.75rem 1.25rem;border-bottom:1px solid var(--surface-200);background:var(--surface-50)}
    .result-count{font-size:.85rem;color:var(--surface-500);font-weight:500;display:flex;align-items:center;gap:.4rem}
    .lib-table{width:100%;border-collapse:collapse;font-size:.9rem}
    .lib-table th{background:var(--usco-vinotinto);color:white;padding:.75rem 1rem;text-align:left;font-weight:600;font-size:.82rem;text-transform:uppercase;letter-spacing:.03em}
    .lib-table td{padding:.7rem 1rem;border-bottom:1px solid var(--surface-100);vertical-align:top}
    .lib-table tbody tr:last-child td{border-bottom:none}
    .lib-table tbody tr:hover{background:rgba(143,20,27,.035)}
    .num-col{color:var(--usco-vinotinto);font-weight:700;text-align:center;vertical-align:middle!important}
    .title-col strong{display:block;color:var(--usco-gris-dark)}
    .isbn-tag{font-size:.75rem;color:var(--surface-400);margin-top:.2rem}
    .desc-tag{font-size:.8rem;color:var(--surface-500);margin-top:.3rem;line-height:1.5;font-style:italic}
    .editorial-col{font-size:.88rem;color:var(--surface-600)}
    .ed-item{display:block;line-height:1.6}
    .ejemplares-badge{display:inline-flex;align-items:center;justify-content:center;background:rgba(143,20,27,.1);color:var(--usco-vinotinto);font-weight:700;font-size:.9rem;width:36px;height:36px;border-radius:50%}

    @media(max-width:768px){
      .lib-table th,.lib-table td{padding:.6rem .6rem}
      .ph-content h1{font-size:1.6rem}
    }
  `,
})
export class BibliotecaComponent implements OnInit {
  private fs = inject(FirestoreService);

  libros = signal<LibroItem[]>([]);
  filteredLibros = signal<LibroItem[]>([]);
  loading = signal(true);
  searchTerm = '';

  ngOnInit() {
    this.fs.getCollection<LibroItem>('libros').subscribe(d => {
      const data = d || [];
      this.libros.set(data);
      this.filteredLibros.set(data);
      this.loading.set(false);
    });
  }

  filterLibros() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) { this.filteredLibros.set(this.libros()); return; }
    this.filteredLibros.set(
      this.libros().filter(l =>
        (l.titulo || '').toLowerCase().includes(term) ||
        (l.autor || '').toLowerCase().includes(term) ||
        (l.editorial || '').toLowerCase().includes(term) ||
        (l.isbn || '').toLowerCase().includes(term)
      )
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredLibros.set(this.libros());
  }

  splitEditoriales(editorial: string): string[] {
    if (!editorial) return ['—'];
    return editorial.split('•').map(e => e.trim()).filter(e => e);
  }
}
