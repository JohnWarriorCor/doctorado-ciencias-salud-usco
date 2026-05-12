import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Menubar, Dialog, InputText, Password, Button],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  today = new Date();
  showLoginDialog = false;
  email = '';
  password = '';
  showRecovery = false;
  loginError = '';

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'fa-solid fa-house',
      routerLink: '/inicio',
    },
    {
      label: 'Programa',
      icon: 'far fa-building',
      items: [
        { label: 'Historia', icon: 'fas fa-book-open', routerLink: '/historia' },
        { label: 'Organigrama', icon: 'fas fa-code-branch', routerLink: '/organigrama' },
        { label: 'Ubicación', icon: 'fas fa-map-marker-alt', routerLink: '/ubicacion' },
      ],
    },
    {
      label: 'Formación',
      icon: 'fas fa-university',
      items: [
        { label: 'Plan de estudios', icon: 'fas fa-book-reader', routerLink: '/plan-de-estudios' },
        { label: 'Competencias', icon: 'fas fa-bullseye', routerLink: '/competencias' },
        { label: 'Perfil', icon: 'fas fa-user-tie', routerLink: '/perfil' },
      ],
    },
    {
      label: 'Actividades',
      icon: 'far fa-newspaper',
      items: [
        { label: 'De Programa', icon: 'fas fa-newspaper', routerLink: '/agenda-programa' },
        { label: 'Institucionales', icon: 'fas fa-rss-square', routerLink: '/agenda-institucional' },
      ],
    },
    {
      label: 'Investigación',
      icon: 'fas fa-microscope',
      routerLink: '/grupos-investigacion',
    },
    {
      label: 'Estudiantes',
      icon: 'fas fa-user-circle',
      items: [
        { label: 'Nuestros estudiantes', icon: 'fas fa-user-friends', routerLink: '/estudiantes' },
        { label: 'Artículos publicados', icon: 'fas fa-paperclip', routerLink: '/articulos-estudiantes' },
        { label: 'Tesis', icon: 'fas fa-file-pdf', routerLink: '/tesis' },
        { label: 'Egresados', icon: 'fas fa-user-graduate', routerLink: '/egresados' },
      ],
    },
    {
      label: 'Profesores',
      icon: 'fas fa-users',
      items: [
        { label: 'Plantel', icon: 'fas fa-user-friends', routerLink: '/docentes' },
        { label: 'Artículos publicados', icon: 'fas fa-scroll', routerLink: '/articulos-docentes' },
      ],
    },
    {
      label: 'Biblioteca',
      icon: 'fas fa-book',
      items: [
        { label: 'Libros del Programa', icon: 'fas fa-book', routerLink: '/biblioteca' },
        { label: 'Galería de imágenes', icon: 'far fa-images', routerLink: '/galeria-imagenes' },
      ],
    },
  ];

  async login(): Promise<void> {
    try {
      this.loginError = '';
      await this.authService.login(this.email, this.password);
      this.showLoginDialog = false;
      this.email = '';
      this.password = '';
    } catch {
      this.loginError = 'Credenciales incorrectas. Intente de nuevo.';
    }
  }

  async recoverPassword(): Promise<void> {
    try {
      await this.authService.resetPassword(this.email);
      this.showRecovery = false;
      this.loginError = 'Se ha enviado un correo para recuperar su contraseña.';
    } catch {
      this.loginError = 'Error al enviar el correo de recuperación.';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
