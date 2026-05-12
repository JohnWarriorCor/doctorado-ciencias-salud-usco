import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../core/services/firestore.service';
import { Libro } from '../../core/models';

@Component({
  selector: 'app-biblioteca', standalone: true, imports: [CommonModule],
  template: `
    <div class="page-hero"><div class="ph"><h1>Biblioteca</h1><p>Libros y publicaciones del programa</p></div></div>
    <section class="section"><div class="container">
      @for (lib of libros(); track lib.key || $index) {
        @if(lib.fieldArray && lib.fieldArray.length) {
          <div class="card-usco" style="padding:2rem;margin-bottom:1.5rem">
            <table class="lib-table">
              <thead><tr>@for(h of getHeaders(lib.fieldArray[0]); track h){<th>{{h}}</th>}</tr></thead>
              <tbody>@for(row of lib.fieldArray; track $index){<tr>@for(h of getHeaders(lib.fieldArray[0]); track h){<td>{{row[h]}}</td>}</tr>}</tbody>
            </table>
          </div>
        }
      }
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}.ph h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}.ph p{font-size:1.1rem;opacity:.8}
    .lib-table{width:100%;border-collapse:collapse;font-size:.88rem}
    .lib-table th{background:var(--usco-vinotinto);color:white;padding:.7rem 1rem;text-align:left;font-weight:600;font-size:.82rem;text-transform:uppercase}
    .lib-table td{padding:.65rem 1rem;border-bottom:1px solid var(--surface-200)}
    .lib-table tbody tr:hover{background:rgba(143,20,27,.04)}
  `,
})
export class BibliotecaComponent implements OnInit {
  private fs = inject(FirestoreService);
  libros = signal<Libro[]>([]);
  ngOnInit() {
    this.fs.getCollection<Libro>('libros').subscribe(d => this.libros.set(d || []));
  }
  getHeaders(obj: any): string[] { return obj ? Object.keys(obj).filter(k => k !== '$key' && k !== 'key' && k !== 'id' && !k.startsWith('_')) : []; }
}
