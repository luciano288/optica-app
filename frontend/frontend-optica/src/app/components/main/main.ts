import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteFormComponent } from '../paciente/paciente-form';
import { ListaPacientesComponent } from '../lista-pacientes/lista-pacientes';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, PacienteFormComponent, ListaPacientesComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  seccion: 'form' | 'list' = 'form';

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
