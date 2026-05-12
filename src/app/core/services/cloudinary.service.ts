import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private http = inject(HttpClient);
  private cloudName = environment.cloudinary.cloudName;
  private uploadPreset = environment.cloudinary.uploadPreset;
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  /**
   * Sube un archivo a Cloudinary usando un upload preset unsigned.
   * @param file Archivo a subir
   * @param folder Carpeta opcional en Cloudinary (ej. 'docentes', 'carrusel')
   * @returns URL pública de la imagen subida
   */
  async uploadFile(file: File, folder?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    if (folder) {
      formData.append('folder', `doctorado/${folder}`);
    }

    const response = await firstValueFrom(
      this.http.post<CloudinaryResponse>(this.uploadUrl, formData)
    );
    return response.secure_url;
  }

  /**
   * Sube un archivo genérico (PDF, etc.) a Cloudinary.
   * @param file Archivo a subir
   * @param folder Carpeta opcional
   * @returns URL pública del archivo subido
   */
  async uploadRawFile(file: File, folder?: string): Promise<string> {
    const rawUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/raw/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    if (folder) {
      formData.append('folder', `doctorado/${folder}`);
    }

    const response = await firstValueFrom(
      this.http.post<CloudinaryResponse>(rawUrl, formData)
    );
    return response.secure_url;
  }

  /**
   * Genera una URL optimizada para la imagen usando transformaciones de Cloudinary.
   */
  getOptimizedUrl(publicId: string, width?: number, height?: number): string {
    let transformations = 'f_auto,q_auto';
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformations}/${publicId}`;
  }
}

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
}
