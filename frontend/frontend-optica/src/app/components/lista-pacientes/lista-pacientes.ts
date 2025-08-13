import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { AuthService } from '../../services/auth.service';
import { API_BASE } from '../../services/api-config';

@Component({
  selector: 'app-lista-pacientes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './lista-pacientes.component.html',
  styleUrls: ['./lista-pacientes.component.css']
})
export class ListaPacientesComponent implements OnInit {
  pacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  loading: boolean = true;
  error: boolean = false;
  unauthorized: boolean = false;
  terminoBusqueda: string = '';
  eliminando: Record<string, boolean> = {};

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.loading = true;
    this.error = false;
    
    const headers = new HttpHeaders(this.auth.getAuthHeader());
    this.http.get(`${API_BASE}/pacientes`, { headers }).subscribe({
      next: (data: any) => {
        this.pacientes = Array.isArray(data) ? data : [];
        this.aplicarFiltroOrden();
        this.loading = false;
        this.error = false;
        this.unauthorized = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = true;
        this.unauthorized = error?.status === 401;
      }
    });
  }

  verOrden(pacienteId: string) {
    this.router.navigate(['/orden', pacienteId]);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';
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

  aplicarFiltroOrden() {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    const base = this.pacientes.slice();
    const filtrados = termino
      ? base.filter(p => (p?.paciente || '').toLowerCase().includes(termino))
      : base;
    filtrados.sort((a, b) => (a?.paciente || '').localeCompare(b?.paciente || '', 'es', { sensitivity: 'base' }));
    this.pacientesFiltrados = filtrados;
  }

  eliminarPaciente(pacienteId: string, event?: Event) {
    if (event) { event.stopPropagation(); }
    const confirmar = window.confirm('¿Desea borrar este paciente? Esta acción no se puede deshacer.');
    if (!confirmar) return;
    this.eliminando[pacienteId] = true;
    const headers = new HttpHeaders(this.auth.getAuthHeader());
    this.http.delete(`${API_BASE}/pacientes/${pacienteId}`, { headers }).subscribe({
      next: () => {
        this.pacientes = this.pacientes.filter(p => p._id !== pacienteId);
        this.aplicarFiltroOrden();
        delete this.eliminando[pacienteId];
      },
      error: () => {
        delete this.eliminando[pacienteId];
        alert('No se pudo eliminar el paciente.');
      }
    });
  }

  descargarPDF(paciente: any) {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'cm',
      format: [8, 4.7]
    });

    // Fondo blanco y borde
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 8, 4.7, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.05);
    pdf.rect(0.1, 0.1, 7.8, 4.5);

    // Título
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Optica Social Alvear 717', 0.3, 0.8);

    // Número de orden
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`#${paciente._id}`, 0.3, 1.3);

    // Fecha
    pdf.text(this.formatearFecha(paciente.fecha), 0.3, 1.8);

    // Nombre del paciente
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(paciente.paciente, 0.3, 3.0);

    // Recuadro para QR (negro de fondo)
    pdf.setDrawColor(0, 0, 0);
    pdf.setFillColor(0, 0, 0);
    pdf.rect(5.0, 1.2, 2.5, 2.5, 'F');

    // Agregar el QR real si existe
    if (paciente.codigoQr) {
      // Elimina el prefijo data:image/png;base64,
      const base64 = paciente.codigoQr.replace(/^data:image\/png;base64,/, '');
      pdf.addImage(base64, 'PNG', 5.1, 1.3, 2.3, 2.3);
    }

    pdf.save(`tarjeta-${paciente._id}.pdf`);
  }
}
