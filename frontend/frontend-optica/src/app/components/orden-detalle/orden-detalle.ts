import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_BASE } from '../../services/api-config';

@Component({
  selector: 'app-orden-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './orden-detalle.component.html',
  styleUrls: ['./orden-detalle.component.css']
})
export class OrdenDetalleComponent implements OnInit {
  paciente: any = null;
  error: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const url = `${API_BASE}/pacientes/${id}`;
      this.http.get(url).subscribe({
        next: (data) => {
          this.paciente = data;
          this.error = false;
        },
        error: (error) => {
          this.paciente = null;
          this.error = true;
        }
      });
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '-';
    if (/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(fecha)) {
      return fecha;
    }
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
}
