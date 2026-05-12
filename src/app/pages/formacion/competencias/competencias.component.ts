import { Component } from '@angular/core';

@Component({
  selector: 'app-competencias',
  standalone: true,
  template: `
    <div class="page-hero"><div class="page-hero-content"><h1>Competencias</h1><p>Competencias del egresado del Doctorado</p></div></div>
    <section class="section"><div class="container">
      <div class="competencias-grid">
        <div class="comp-card card-usco"><div class="comp-icon"><i class="fas fa-flask"></i></div><h3>Investigación Científica</h3><p>Capacidad para diseñar, ejecutar y evaluar proyectos de investigación original en ciencias de la salud con rigor metodológico y ético.</p></div>
        <div class="comp-card card-usco"><div class="comp-icon"><i class="fas fa-brain"></i></div><h3>Pensamiento Crítico</h3><p>Analizar e interpretar críticamente la literatura científica, generando nuevo conocimiento con impacto en la salud pública.</p></div>
        <div class="comp-card card-usco"><div class="comp-icon"><i class="fas fa-chalkboard-teacher"></i></div><h3>Docencia Universitaria</h3><p>Formar nuevas generaciones de profesionales e investigadores en salud con metodologías pedagógicas innovadoras.</p></div>
        <div class="comp-card card-usco"><div class="comp-icon"><i class="fas fa-handshake"></i></div><h3>Gestión del Conocimiento</h3><p>Liderar equipos multidisciplinarios y redes de investigación a nivel nacional e internacional.</p></div>
        <div class="comp-card card-usco"><div class="comp-icon"><i class="fas fa-globe-americas"></i></div><h3>Impacto Social</h3><p>Contribuir a la solución de problemas de salud de la región y el país mediante investigación aplicada.</p></div>
        <div class="comp-card card-usco"><div class="comp-icon"><i class="fas fa-edit"></i></div><h3>Producción Científica</h3><p>Publicar resultados de investigación en revistas indexadas de alto impacto nacional e internacional.</p></div>
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}
    .page-hero h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}
    .page-hero p{font-size:1.1rem;opacity:.8}
    .competencias-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
    .comp-card{padding:2rem;text-align:center;transition:all .3s ease}
    .comp-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
    .comp-icon{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,var(--usco-vinotinto),var(--usco-vinotinto-dark));color:white;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 1.25rem}
    .comp-card h3{font-family:var(--font-primary);font-size:1.05rem;color:var(--usco-gris-dark);margin-bottom:.75rem}
    .comp-card p{font-size:.88rem;line-height:1.6}
    @media(max-width:768px){.competencias-grid{grid-template-columns:1fr}}
  `,
})
export class CompetenciasComponent {}
