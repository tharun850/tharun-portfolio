import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  company?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  private get apiUrl(): string {
    // If deployed on Vercel or any live domain, always use same-origin relative endpoint /api/contact
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/api/contact';
    }
    return environment.apiUrl || '/api/contact';
  }

  async submit(payload: ContactPayload): Promise<{ ok: boolean; message: string }> {
    return firstValueFrom(
      this.http.post<{ ok: boolean; message: string }>(this.apiUrl, payload)
    );
  }
}
