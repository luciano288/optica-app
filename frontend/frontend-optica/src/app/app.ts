import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PacienteFormComponent } from './components/paciente/paciente-form';
import { OrdenDetalleComponent } from './components/orden-detalle/orden-detalle';
import { ListaPacientesComponent } from './components/lista-pacientes/lista-pacientes';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, PacienteFormComponent, OrdenDetalleComponent, ListaPacientesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
