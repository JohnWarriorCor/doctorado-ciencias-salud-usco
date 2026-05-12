import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Dialog, InputText, Password, Button],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  authService = inject(AuthService);
  today = new Date();
  showLoginDialog = false;
  email = '';
  password = '';
  showRecovery = false;
  loginError = '';

  async login(): Promise<void> {
    try {
      this.loginError = '';
      await this.authService.login(this.email, this.password);
      this.showLoginDialog = false;
    } catch {
      this.loginError = 'Credenciales incorrectas.';
    }
  }

  async recoverPassword(): Promise<void> {
    try {
      await this.authService.resetPassword(this.email);
      this.loginError = 'Correo de recuperación enviado.';
    } catch {
      this.loginError = 'Error al enviar correo.';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
