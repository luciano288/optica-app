import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { API_BASE } from '../../services/api-config';
import { NgForm } from '@angular/forms';
import { jsPDF } from 'jspdf';

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
        // Descargar PDF de Detalle de la Orden usando la respuesta del backend
        try {
          this.descargarOrdenPDF(response);
        } catch (e) {
          // En caso de fallo al generar PDF, continuar flujo sin bloquear
          console.error('Error generando PDF de la orden', e);
        }
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

  private formatearFechaLectura(fecha: string): string {
    if (!fecha) return '-';
    // Si ya está en dd/mm/yyyy, devolverla
    if (/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(fecha)) {
      return fecha;
    }
    // Si viene en yyyy-mm-dd, convertir
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [y, m, d] = fecha.split('-');
      return `${d}/${m}/${y}`;
    }
    const d = new Date(fecha);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('es-ES');
    }
    return fecha;
  }

  private descargarOrdenPDF(paciente: any) {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const marginLeft = 20;
    let cursorY = 20;

    // Encabezado
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Detalle de la Orden', marginLeft, cursorY);
    cursorY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Número de Orden: ${paciente?._id ?? '-'}`, marginLeft, cursorY);
    pdf.text(`Fecha: ${this.formatearFechaLectura(paciente?.fecha)}`, 120, cursorY);
    cursorY += 10;

    // Datos del Paciente
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Datos del Paciente', marginLeft, cursorY);
    cursorY += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(`Paciente: ${paciente?.paciente ?? '-'}`, marginLeft, cursorY);
    pdf.text(`Fecha de Nacimiento: ${this.formatearFechaLectura(paciente?.fechaNacimiento)}`, 120, cursorY);
    cursorY += 7;
    pdf.text(`Celular: ${paciente?.celular || 'No especificado'}`, marginLeft, cursorY);
    pdf.text(`Email: ${paciente?.email || 'No especificado'}`, 120, cursorY);
    cursorY += 10;

    // Datos de la Óptica
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Datos de la Óptica', marginLeft, cursorY);
    cursorY += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(`Óptica: ${paciente?.optica ?? '-'}`, marginLeft, cursorY);
    pdf.text(`Doctor: ${paciente?.doctor || 'No especificado'}`, 120, cursorY);
    cursorY += 10;

    // Prescripción
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Prescripción', marginLeft, cursorY);
    cursorY += 7;

    // Tabla simple de prescripción
    const tableStartY = cursorY;
    const colX = [marginLeft, marginLeft + 30, marginLeft + 60, marginLeft + 90, marginLeft + 120, marginLeft + 150, marginLeft + 180];
    const headers = ['Ojo', 'Esf.', 'Cil.', 'Eje', 'Ad.', 'DNP', 'Alt.'];

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    headers.forEach((h, i) => pdf.text(h, colX[i], tableStartY));

    pdf.setFont('helvetica', 'normal');
    const od = paciente?.prescripcion?.OD || {};
    const oi = paciente?.prescripcion?.OI || {};
    const rowGap = 7;

    // OD
    let rowY = tableStartY + rowGap;
    const safe = (v: any) => (v ?? '-') + '';
    const rows = [
      ['OD', safe(od.Esf), safe(od.Cil), safe(od.Eje), safe(od.Ad), safe(od.DNP), safe(od.Alt)],
      ['OI', safe(oi.Esf), safe(oi.Cil), safe(oi.Eje), safe(oi.Ad), safe(oi.DNP), safe(oi.Alt)]
    ];

    rows.forEach((r) => {
      r.forEach((cell, i) => pdf.text(String(cell), colX[i], rowY));
      rowY += rowGap;
    });
    cursorY = rowY + 3;

    // Comentarios
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Comentarios', marginLeft, cursorY);
    cursorY += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const comentario = paciente?.comentario || 'Sin comentarios';
    const split = pdf.splitTextToSize(comentario, 170);
    pdf.text(split, marginLeft, cursorY);
    cursorY += Math.max(10, split.length * 5 + 2);

    // QR (si existe)
    if (paciente?.codigoQr) {
      try {
        const base64 = paciente.codigoQr.replace(/^data:image\/png;base64,/, '');
        // Título QR
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Código QR', marginLeft, cursorY);
        // Imagen QR
        pdf.addImage(base64, 'PNG', marginLeft, cursorY + 5, 40, 40);
        cursorY += 50;
      } catch (_) {
        // Ignorar si no se puede renderizar el QR
      }
    }

    pdf.save(`orden-${paciente?._id ?? 'nueva'}.pdf`);
  }
}
