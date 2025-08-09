import { Injectable } from '@angular/core';
import { API_BASE } from './api-config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'optica_token';

  async login(username: string, password: string): Promise<boolean> {
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!resp.ok) return false;
      const data = await resp.json();
      if (data?.token) {
        localStorage.setItem(this.TOKEN_KEY, data.token);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    // Verificar formato JWT y expiración
    const valid = this.tokenValid(token);
    if (!valid) {
      this.logout();
    }
    return valid;
  }

  getAuthHeader(): { [k: string]: string } {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private tokenValid(token: string): boolean {
    // Debe tener 3 partes separadas por '.'
    if (token.split('.').length !== 3) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && typeof payload.exp === 'number') {
        const nowSec = Math.floor(Date.now() / 1000);
        return payload.exp > nowSec;
      }
      return true; // Si no hay exp, asumir válido (dev)
    } catch {
      return false;
    }
  }
}
