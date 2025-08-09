import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { API_BASE } from '../../services/api-config';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.css']
})
export class PacienteFormComponent {
  _id = '';
  fecha = '';
  paciente = '';
  fechaNacimiento = '';
  celular = '';
  email = '';
  optica = '';
  doctor = '';
  prescripcion = {
    OD: { Esf: '', Cil: '', Eje: '', Ad: '', DNP: '', Alt: '' },
    OI: { Esf: '', Cil: '', Eje: '', Ad: '', DNP: '', Alt: '' }
  };
  comentario = '';
  
  loading = false;
  mensaje = '';
  submitted = false;

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  guardar(form: NgForm) {
    this.submitted = true;
    
    if (form.invalid) {
      this.mensaje = 'Por favor, complete correctamente todos los campos obligatorios';
      return;
    }

    // Validaciones adicionales
    if (!this.validarDNI(this._id)) {
      this.mensaje = 'El DNI debe tener entre 7 y 8 dígitos numéricos';
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.mensaje = 'El formato del email no es válido';
      return;
    }

    if (!this.validarTelefono(this.celular)) {
      this.mensaje = 'El formato del teléfono no es válido';
      return;
    }

    if (!this.esFechaDdMmYyyy(this.fecha) || !this.esFechaDdMmYyyy(this.fechaNacimiento)) {
      this.mensaje = 'Las fechas deben tener formato dd/mm/yyyy válido';
      return;
    }

    this.loading = true;
    this.mensaje = '';

    // Convertir/normalizar fechas al formato dd/mm/yyyy
    const datosPaciente = {
      _id: this._id,
      fecha: this.formatearFechaParaBackend(this.fecha),
      paciente: this.paciente,
      fechaNacimiento: this.formatearFechaParaBackend(this.fechaNacimiento),
      celular: this.celular,
      email: this.email,
      optica: this.optica,
      doctor: this.doctor,
      prescripcion: this.prescripcion,
      comentario: this.comentario
    };

    const headers = new HttpHeaders(this.auth.getAuthHeader());
    this.http.post(`${API_BASE}/pacientes`, datosPaciente, { headers }).subscribe({
      next: (response: any) => {
        this.mensaje = 'Paciente guardado exitosamente';
        this.loading = false;
        this.submitted = false;
        
        // Limpiar formulario
        this.limpiarFormulario();
        
        // Opcional: redirigir a la lista de pacientes
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.mensaje = 'Error al guardar el paciente. Por favor, intente de nuevo.';
        this.loading = false;
      }
    });
  }

  limpiarFormulario() {
    this._id = '';
    this.fecha = '';
    this.paciente = '';
    this.fechaNacimiento = '';
    this.celular = '';
    this.email = '';
    this.optica = '';
    this.doctor = '';
    this.prescripcion = {
      OD: { Esf: '', Cil: '', Eje: '', Ad: '', DNP: '', Alt: '' },
      OI: { Esf: '', Cil: '', Eje: '', Ad: '', DNP: '', Alt: '' }
    };
    this.comentario = '';
    this.submitted = false;
  }

  // Funciones de validación
  validarDNI(dni: string): boolean {
    if (!dni) return false;
    const dniLimpio = dni.replace(/\D/g, '');
    return dniLimpio.length >= 7 && dniLimpio.length <= 8;
  }

  validarEmail(email: string): boolean {
    if (!email) return true; // Email es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validarTelefono(telefono: string): boolean {
    if (!telefono) return true; // Teléfono es opcional
    const telefonoLimpio = telefono.replace(/\D/g, '');
    return telefonoLimpio.length >= 8 && telefonoLimpio.length <= 15;
  }

  formatearFechaParaBackend(fecha: string): string {
    if (!fecha) return '';
    // Si ya viene en dd/mm/yyyy, devolver igual
    if (this.esFechaDdMmYyyy(fecha)) {
      return fecha;
    }
    // Si viene en yyyy-mm-dd, convertir
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [y, m, d] = fecha.split('-');
      return `${d}/${m}/${y}`;
    }
    // Intentar parsear y formatear
    const fechaObj = new Date(fecha);
    if (!isNaN(fechaObj.getTime())) {
      const dia = fechaObj.getDate().toString().padStart(2, '0');
      const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
      const año = fechaObj.getFullYear();
      return `${dia}/${mes}/${año}`;
    }
    return fecha;
  }

  esFechaDdMmYyyy(valor: string): boolean {
    if (!valor) return false;
    const m = valor.match(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/);
    if (!m) return false;
    const dia = parseInt(m[1], 10);
    const mes = parseInt(m[2], 10) - 1;
    const año = parseInt(m[3], 10);
    const dt = new Date(año, mes, dia);
    return dt.getFullYear() === año && dt.getMonth() === mes && dt.getDate() === dia;
  }
}
