import { Routes } from '@angular/router';
import { OrdenDetalleComponent } from './components/orden-detalle/orden-detalle';
import { LoginComponent } from './components/login/login';
import { MainComponent } from './components/main/main';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'orden/:id', component: OrdenDetalleComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: MainComponent, canActivate: [authGuard] }
];
