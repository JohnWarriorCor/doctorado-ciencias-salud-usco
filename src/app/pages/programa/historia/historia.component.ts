import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-hero"><div class="page-hero-content"><h1>Historia del Programa</h1><p>Trayectoria del Doctorado en Ciencias de la Salud</p></div></div>
    <section class="section"><div class="container">
      <div class="timeline">
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content card-usco">
          <h3>Antecedentes</h3>
          <p>El Doctorado en Ciencias de la Salud de la Universidad Surcolombiana nace como respuesta a la necesidad de formación de investigadores de alto nivel en el sur de Colombia, una región con grandes desafíos en materia de salud pública.</p>
        </div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content card-usco">
          <h3>Creación del Programa</h3>
          <p>El programa fue creado con el objetivo de generar nuevo conocimiento científico en las áreas de ciencias biomédicas, ciencias clínicas y salud pública, mediante investigación de alto impacto con relevancia regional y nacional.</p>
        </div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content card-usco">
          <h3>Acreditación de Alta Calidad</h3>
          <p>El programa ha alcanzado estándares de alta calidad reconocidos por el Ministerio de Educación Nacional, consolidándose como referente académico e investigativo en la región surcolombiana.</p>
        </div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content card-usco">
          <h3>Actualidad</h3>
          <p>Hoy el programa cuenta con líneas de investigación consolidadas, convenios internacionales y un equipo docente con formación doctoral, comprometido con la generación de conocimiento para la transformación social.</p>
        </div></div>
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}
    .page-hero h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}
    .page-hero p{font-size:1.1rem;opacity:.8;max-width:600px;margin:0 auto}
    .timeline{position:relative;padding-left:40px}
    .timeline::before{content:'';position:absolute;left:15px;top:0;bottom:0;width:3px;background:linear-gradient(to bottom,#8f141b,#dfd4a6);border-radius:4px}
    .timeline-item{position:relative;margin-bottom:2rem}
    .timeline-dot{position:absolute;left:-33px;top:1.5rem;width:14px;height:14px;border-radius:50%;background:#8f141b;border:3px solid white;box-shadow:0 0 0 3px rgba(143,20,27,.2);z-index:1}
    .timeline-content{padding:1.5rem;animation:fadeInUp .6s ease-out}
    .timeline-content h3{font-family:var(--font-primary);font-size:1.15rem;color:var(--usco-vinotinto);margin-bottom:.75rem}
    .timeline-content p{font-size:.92rem;line-height:1.7}
  `,
})
export class HistoriaComponent {}
