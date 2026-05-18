import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-hero"><h1><i class="fas fa-cogs"></i> Panel de Administración</h1></div>
    <div class="admin-container">
      <!-- CRUD Links -->
      <h3 style="margin-bottom:1.5rem"><i class="fas fa-edit"></i> Gestión de Contenido</h3>
      <div class="admin-grid">
        <a routerLink="/admin/carrusel" class="admin-card card-usco"><div class="ac-icon bg-1"><i class="fas fa-images"></i></div><h4>Carrusel</h4><p>Slides de la página principal</p></a>
        <a routerLink="/admin/docentes" class="admin-card card-usco"><div class="ac-icon bg-2"><i class="fas fa-chalkboard-teacher"></i></div><h4>Docentes</h4><p>Plantel de profesores</p></a>
        <a routerLink="/admin/estudiantes" class="admin-card card-usco"><div class="ac-icon bg-3"><i class="fas fa-user-graduate"></i></div><h4>Estudiantes</h4><p>Estudiantes activos</p></a>
        <a routerLink="/admin/egresados" class="admin-card card-usco"><div class="ac-icon bg-4"><i class="fas fa-graduation-cap"></i></div><h4>Egresados</h4><p>Doctores graduados</p></a>
        <a routerLink="/admin/eventos-programa" class="admin-card card-usco"><div class="ac-icon bg-5"><i class="fas fa-calendar-alt"></i></div><h4>Eventos Programa</h4><p>Agenda del programa</p></a>
        <a routerLink="/admin/eventos-institucionales" class="admin-card card-usco"><div class="ac-icon bg-6"><i class="fas fa-university"></i></div><h4>Eventos USCO</h4><p>Agenda institucional</p></a>
        <a routerLink="/admin/investigacion" class="admin-card card-usco"><div class="ac-icon bg-7"><i class="fas fa-microscope"></i></div><h4>Investigación</h4><p>Grupos de investigación</p></a>
        <a routerLink="/admin/biblioteca" class="admin-card card-usco"><div class="ac-icon bg-8"><i class="fas fa-book"></i></div><h4>Biblioteca</h4><p>Libros y publicaciones</p></a>
      </div>
    </div>
  `,
  styles: `
    .admin-hero{background:linear-gradient(135deg,#1e262b,#8f141b);padding:4rem 2rem 2.5rem;text-align:center}
    .admin-hero h1{color:white;font-size:1.8rem;display:flex;align-items:center;justify-content:center;gap:.75rem}
    .admin-container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem}
    .admin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
    .admin-card{display:block;padding:1.5rem;text-align:center;transition:all .3s}
    .admin-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
    .ac-icon{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto .75rem;font-size:1.3rem;color:white}
    .bg-1{background:linear-gradient(135deg,#8f141b,#5c0e12)}.bg-2{background:linear-gradient(135deg,#1a73e8,#0d47a1)}.bg-3{background:linear-gradient(135deg,#e65100,#bf360c)}
    .bg-4{background:linear-gradient(135deg,#2e7d32,#1b5e20)}.bg-5{background:linear-gradient(135deg,#6a1b9a,#4a148c)}.bg-6{background:linear-gradient(135deg,#00838f,#006064)}.bg-7{background:linear-gradient(135deg,#ad1457,#880e4f)}.bg-8{background:linear-gradient(135deg,#5d4037,#3e2723)}
    .admin-card h4{font-family:var(--font-primary);font-size:.95rem;margin-bottom:.3rem;color:var(--usco-gris-dark)}
    .admin-card p{font-size:.82rem;color:var(--surface-600)}
    @media(max-width:768px){.admin-grid{grid-template-columns:repeat(2,1fr)}}
  `,
})
export class AdminComponent {}
