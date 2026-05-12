import { Component } from '@angular/core';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  template: `
    <div class="page-hero"><div class="page-hero-content"><h1>Ubicación</h1><p>Encuéntranos en la ciudad de Neiva, Huila</p></div></div>
    <section class="section"><div class="container">
      <div class="location-grid">
        <div class="location-info card-usco" style="padding:2rem">
          <h3><i class="fas fa-map-marker-alt" style="color:var(--usco-vinotinto)"></i> Dirección</h3>
          <p>Calle 9 No. 14-03, Contiguo al Hospital Universitario de Neiva</p>
          <p>Unidad de Investigación y Posgrados, Oficina 530 - 102</p>
          <p>Neiva, Huila - Colombia</p>
          <hr style="margin:1.5rem 0;border-color:var(--surface-200)"/>
          <h3><i class="fas fa-phone" style="color:var(--usco-vinotinto)"></i> Contacto</h3>
          <p><i class="fas fa-phone"></i> (57) (8) 871 8959</p>
          <p><i class="fas fa-print"></i> (57) (8) 871 8310 Ext. 3137</p>
          <p><i class="fas fa-envelope"></i> doctoradoencienciasdelasalud&#64;usco.edu.co</p>
        </div>
        <div class="location-map card-usco" style="overflow:hidden">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3!2d-75.282!3d2.9263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNTUnMzQuNyJOIDc1wrAxNic1NS4yIlc!5e0!3m2!1ses!2sco!4v1600000000000" width="100%" height="450" style="border:0;border-radius:var(--radius-lg)" allowfullscreen loading="lazy"></iframe>
        </div>
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}
    .page-hero h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}
    .page-hero p{font-size:1.1rem;opacity:.8}
    .location-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:2rem;align-items:start}
    .location-info h3{font-family:var(--font-primary);font-size:1.05rem;margin-bottom:.75rem}
    .location-info p{font-size:.9rem;margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem}
    @media(max-width:768px){.location-grid{grid-template-columns:1fr}}
  `,
})
export class UbicacionComponent {}
