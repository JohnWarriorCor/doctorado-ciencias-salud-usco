import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Carousel } from 'primeng/carousel';
import { Tag } from 'primeng/tag';
import { FirestoreService } from '../../core/services/firestore.service';
import { Carrusel, Denominacion, Docente, Evento } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Carousel, Tag],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private fs = inject(FirestoreService);

  slides = signal<Carrusel[]>([]);
  denominacion = signal<Denominacion | null>(null);
  docentes = signal<Docente[]>([]);
  eventos = signal<Evento[]>([]);

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 },
  ];

  docenteResponsive = [
    { breakpoint: '1200px', numVisible: 3, numScroll: 1 },
    { breakpoint: '992px', numVisible: 2, numScroll: 1 },
    { breakpoint: '576px', numVisible: 1, numScroll: 1 },
  ];

  counters = [
    { value: 0, target: 14, suffix: '', label: 'Semestres', icon: 'fas fa-calendar-alt' },
    { value: 0, target: 90, suffix: '', label: 'Créditos', icon: 'fas fa-graduation-cap' },
    { value: 0, target: 7, suffix: '', label: 'Líneas de investigación', icon: 'fas fa-microscope' },
    { value: 0, target: 25, suffix: '+', label: 'Años de trayectoria', icon: 'fas fa-award' },
  ];

  ngOnInit(): void {
    this.fs.getCollection<Carrusel>('carrusel').subscribe((data) => {
      this.slides.set((data || []).filter((s) => s.estado === 1));
    });

    this.fs.getCollection<Denominacion>('denominacion').subscribe((data) => {
      if (data?.length) this.denominacion.set(data[0]);
    });

    this.fs.getCollection<Docente>('docentes').subscribe((data) => {
      this.docentes.set(data?.slice(0, 8) || []);
    });

    this.fs.getCollection<Evento>('eventosPrograma').subscribe((data) => {
      this.eventos.set(data?.slice(0, 6) || []);
    });

    this.animateCounters();
  }

  private animateCounters(): void {
    setTimeout(() => {
      this.counters.forEach((counter) => {
        const duration = 2000;
        const steps = 60;
        const increment = counter.target / steps;
        let current = 0;
        const interval = setInterval(() => {
          current += increment;
          if (current >= counter.target) {
            counter.value = counter.target;
            clearInterval(interval);
          } else {
            counter.value = Math.floor(current);
          }
        }, duration / steps);
      });
    }, 500);
  }
}
