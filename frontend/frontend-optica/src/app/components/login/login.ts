import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  currentYear = new Date().getFullYear();

  constructor(private auth: AuthService, private router: Router) {}

  async ingresar() {
    this.error = '';
    this.loading = true;
    const ok = await this.auth.login(this.username.trim(), this.password);
    this.loading = false;
    if (ok) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }
}
