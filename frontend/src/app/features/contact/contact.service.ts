import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  // honeypot field: real users never fill this in; bots often do
  company?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  // Uses environment.apiUrl (defaults to local in dev, or your deployed Render backend in prod)
  private readonly API_URL = environment.apiUrl;

  async submit(payload: ContactPayload): Promise<{ ok: boolean; message: string }> {
    return firstValueFrom(
      this.http.post<{ ok: boolean; message: string }>(this.API_URL, payload)
    );
  }
}
