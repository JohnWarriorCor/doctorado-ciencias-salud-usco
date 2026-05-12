import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  standalone: true,
  template: `
    <div class="page-hero"><div class="page-hero-content"><h1>Perfil del Egresado</h1><p>Características del Doctor en Ciencias de la Salud</p></div></div>
    <section class="section"><div class="container">
      <div class="perfil-grid">
        <div class="perfil-main card-usco" style="padding:2.5rem">
          <h3><i class="fas fa-user-graduate" style="color:var(--usco-vinotinto)"></i> Perfil Profesional</h3>
          <p>El Doctor en Ciencias de la Salud de la Universidad Surcolombiana es un investigador de alto nivel, capaz de generar conocimiento original y relevante en las áreas de ciencias biomédicas, ciencias clínicas y salud pública.</p>
          <p>Está preparado para liderar grupos de investigación, dirigir trabajos de grado a nivel de maestría y doctorado, y contribuir significativamente al desarrollo científico del país.</p>
          <h3 style="margin-top:2rem"><i class="fas fa-briefcase" style="color:var(--usco-vinotinto)"></i> Campo de Acción</h3>
          <ul class="perfil-list">
            <li><i class="fas fa-check-circle"></i> Universidades e instituciones de educación superior</li>
            <li><i class="fas fa-check-circle"></i> Centros y grupos de investigación</li>
            <li><i class="fas fa-check-circle"></i> Instituciones del sector salud</li>
            <li><i class="fas fa-check-circle"></i> Entidades gubernamentales de ciencia y tecnología</li>
            <li><i class="fas fa-check-circle"></i> Organismos internacionales de salud</li>
            <li><i class="fas fa-check-circle"></i> Industria farmacéutica y biotecnológica</li>
          </ul>
        </div>
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}
    .page-hero h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}
    .page-hero p{font-size:1.1rem;opacity:.8}
    .perfil-main{max-width:800px;margin:0 auto}
    .perfil-main h3{font-family:var(--font-primary);font-size:1.15rem;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem}
    .perfil-main p{font-size:.92rem;line-height:1.7;margin-bottom:1rem}
    .perfil-list{list-style:none;margin-top:1rem}
    .perfil-list li{display:flex;align-items:center;gap:.75rem;padding:.6rem 0;font-size:.92rem;border-bottom:1px solid var(--surface-200)}
    .perfil-list li i{color:var(--usco-vinotinto);font-size:.85rem}
  `,
})
export class PerfilComponent {}
