import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'historia',
    loadComponent: () =>
      import('./pages/programa/historia/historia.component').then(
        (m) => m.HistoriaComponent
      ),
  },
  {
    path: 'organigrama',
    loadComponent: () =>
      import('./pages/programa/organigrama/organigrama.component').then(
        (m) => m.OrganigramaComponent
      ),
  },
  {
    path: 'ubicacion',
    loadComponent: () =>
      import('./pages/programa/ubicacion/ubicacion.component').then(
        (m) => m.UbicacionComponent
      ),
  },
  {
    path: 'plan-de-estudios',
    loadComponent: () =>
      import('./pages/formacion/plan-estudios/plan-estudios.component').then(
        (m) => m.PlanEstudiosComponent
      ),
  },
  {
    path: 'competencias',
    loadComponent: () =>
      import('./pages/formacion/competencias/competencias.component').then(
        (m) => m.CompetenciasComponent
      ),
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/formacion/perfil/perfil.component').then(
        (m) => m.PerfilComponent
      ),
  },
  {
    path: 'docentes',
    loadComponent: () =>
      import('./pages/docentes/docentes.component').then(
        (m) => m.DocentesComponent
      ),
  },
  {
    path: 'articulos-docentes',
    loadComponent: () =>
      import('./pages/docentes/articulos-docentes/articulos-docentes.component').then(
        (m) => m.ArticulosDocentesComponent
      ),
  },
  {
    path: 'estudiantes',
    loadComponent: () =>
      import('./pages/estudiantes/estudiantes.component').then(
        (m) => m.EstudiantesComponent
      ),
  },
  {
    path: 'articulos-estudiantes',
    loadComponent: () =>
      import('./pages/estudiantes/articulos-estudiantes/articulos-estudiantes.component').then(
        (m) => m.ArticulosEstudiantesComponent
      ),
  },
  {
    path: 'tesis',
    loadComponent: () =>
      import('./pages/estudiantes/tesis/tesis.component').then(
        (m) => m.TesisComponent
      ),
  },
  {
    path: 'egresados',
    loadComponent: () =>
      import('./pages/estudiantes/egresados/egresados.component').then(
        (m) => m.EgresadosComponent
      ),
  },
  {
    path: 'grupos-investigacion',
    loadComponent: () =>
      import('./pages/investigacion/investigacion.component').then(
        (m) => m.InvestigacionComponent
      ),
  },
  {
    path: 'biblioteca',
    loadComponent: () =>
      import('./pages/biblioteca/biblioteca.component').then(
        (m) => m.BibliotecaComponent
      ),
  },
  {
    path: 'galeria-imagenes',
    loadComponent: () =>
      import('./pages/biblioteca/galeria/galeria.component').then(
        (m) => m.GaleriaComponent
      ),
  },
  {
    path: 'agenda-programa',
    loadComponent: () =>
      import('./pages/eventos/eventos-programa/eventos-programa.component').then(
        (m) => m.EventosProgramaComponent
      ),
  },
  {
    path: 'agenda-institucional',
    loadComponent: () =>
      import('./pages/eventos/eventos-institucionales/eventos-institucionales.component').then(
        (m) => m.EventosInstitucionalesComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'admin/carrusel',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/admin-carrusel/admin-carrusel.component').then((m) => m.AdminCarruselComponent),
  },
  {
    path: 'admin/docentes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/admin-docentes/admin-docentes.component').then((m) => m.AdminDocentesComponent),
  },
  {
    path: 'admin/estudiantes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/admin-estudiantes/admin-estudiantes.component').then((m) => m.AdminEstudiantesComponent),
  },
  {
    path: 'admin/egresados',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/admin-egresados/admin-egresados.component').then((m) => m.AdminEgresadosComponent),
  },
  {
    path: 'admin/eventos-programa',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/admin-eventos/admin-eventos.component').then((m) => m.AdminEventosComponent),
  },
  {
    path: 'admin/eventos-institucionales',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/admin-eventos/admin-eventos.component').then((m) => m.AdminEventosComponent),
  },
  { path: '**', redirectTo: 'inicio' },
];
