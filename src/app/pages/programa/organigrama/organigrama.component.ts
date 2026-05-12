import { Component } from '@angular/core';

@Component({
  selector: 'app-organigrama',
  standalone: true,
  template: `
    <div class="page-hero"><div class="page-hero-content"><h1>Organigrama</h1><p>Estructura organizacional del Doctorado</p></div></div>
    <section class="section"><div class="container" style="text-align:center">
      <div class="org-card card-usco" style="padding:2rem">
        <img src="images/organigrama1.jpg" alt="Organigrama del Doctorado en Ciencias de la Salud" style="max-width:100%;border-radius:var(--radius-md)"/>
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}
    .page-hero h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}
    .page-hero p{font-size:1.1rem;opacity:.8}
    .org-card{max-width:900px;margin:0 auto}
  `,
})
export class OrganigramaComponent {}
