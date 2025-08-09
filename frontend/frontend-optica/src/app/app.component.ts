import { Component } from '@angular/core';
import { PacienteFormComponent } from './components/paciente/paciente-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PacienteFormComponent],
  template: `<app-paciente-form></app-paciente-form>`,
})
export class AppComponent {}
