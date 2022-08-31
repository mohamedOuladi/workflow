import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PluginX } from '../types';

@Injectable({
  providedIn: 'root',
})
export class PluginsService {
  private readonly baseUrl = 'https://compute.scb-ncats.io/compute/plugins';

  constructor(private http: HttpClient) {}

  getPlugins() {
    return this.http.get<PluginX[]>(this.baseUrl );
  }
}
