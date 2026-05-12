import { Component } from '@angular/core';

@Component({
  selector: 'app-galeria',
  standalone: true,
  template: `
    <div class="page-hero"><div class="ph"><h1>Galería de Imágenes</h1><p>Momentos del programa doctoral</p></div></div>
    <section class="section"><div class="container" style="text-align:center">
      <div class="gallery-grid">
        <div class="gallery-item card-usco"><img src="images/slide-biblioteca.jpg" alt="Biblioteca USCO"/></div>
        <div class="gallery-item card-usco"><img src="images/slide-galeria-imagenes.jpg" alt="Galería Imágenes"/></div>
        <div class="gallery-item card-usco"><img src="images/slide-estudiantes.jpg" alt="Nuestros Estudiantes"/></div>
        <div class="gallery-item card-usco"><img src="images/slide-egresados.jpg" alt="Nuestros Egresados"/></div>
        <div class="gallery-item card-usco"><img src="images/slide-agenda-institucional.jpg" alt="Agenda Institucional"/></div>
        <div class="gallery-item card-usco"><img src="images/slide-grupos-investigacion.jpg" alt="Grupos de Investigación"/></div>
      </div>
    </div></section>
  `,
  styles: `
    .page-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:5rem 1.5rem 3rem;text-align:center;color:white}.ph h1{font-size:clamp(2rem,4vw,3rem);margin-bottom:.75rem;color:white}.ph p{font-size:1.1rem;opacity:.8}
    .gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
    .gallery-item{overflow:hidden;border-radius:var(--radius-lg)}
    .gallery-item img{width:100%;height:250px;object-fit:cover;transition:transform .4s ease}
    .gallery-item:hover img{transform:scale(1.08)}
    @media(max-width:768px){.gallery-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:480px){.gallery-grid{grid-template-columns:1fr}}
  `,
})
export class GaleriaComponent {}
