import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../core/services/firestore.service';
import { PlanEstudios } from '../../../core/models';

@Component({
  selector: 'app-plan-estudios', standalone: true, imports: [CommonModule],
  template: `
    <div class="page-hero"><div class="page-hero-content"><h1>Plan de Estudios</h1><p>Estructura curricular del programa doctoral</p></div></div>
    <section class="section"><div class="container">
      @if (planData().length) {
        @for (plan of planData(); track plan.key || $index) {
          @if (plan.fieldArray && plan.fieldArray.length) {
            <div class="plan-group card-usco" style="padding:2rem;margin-bottom:2rem">
              <table class="plan-table">
                <thead><tr>@for (header of getHeaders(plan.fieldArray[0]); track header){<th>{{ header }}</th>}</tr></thead>
                <tbody>@for (row of plan.fieldArray; track $index){<tr>@for (header of getHeaders(plan.fieldArray[0]); track header){<td>{{ row[header] }}</td>}</tr>}</tbody>
              </table>
            </div>
          }
        }
      } @else {
        <div class="empty-state"><i class="fas fa-book-reader"></i><p>Cargando plan de estudios...</p></div>
      }
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}
    .page-hero h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}
    .page-hero p{font-size:1.1rem;opacity:.8}
    .plan-table{width:100%;border-collapse:collapse;font-size:.9rem}
    .plan-table th{background:var(--usco-vinotinto);color:white;padding:.75rem 1rem;text-align:left;font-weight:600;font-size:.85rem;text-transform:uppercase;letter-spacing:.03em}
    .plan-table td{padding:.7rem 1rem;border-bottom:1px solid var(--surface-200)}
    .plan-table tbody tr:hover{background:var(--usco-vinotinto-50)}
    .plan-table tbody tr:nth-child(even){background:var(--surface-50)}
    .empty-state{text-align:center;padding:4rem 2rem;color:var(--surface-400)}
    .empty-state i{font-size:3rem;margin-bottom:1rem}
  `,
})
export class PlanEstudiosComponent implements OnInit {
  private fs = inject(FirestoreService);
  planData = signal<PlanEstudios[]>([]);

  ngOnInit(): void {
    this.fs.getCollection<PlanEstudios>('planEstudios').subscribe(d => this.planData.set(d || []));
  }

  getHeaders(obj: any): string[] {
    return obj ? Object.keys(obj).filter(k => k !== '$key' && k !== 'key' && k !== 'id' && !k.startsWith('_')) : [];
  }
}
