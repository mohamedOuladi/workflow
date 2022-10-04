import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PluginX } from '../types';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({
  providedIn: 'root',
})
export class PluginsService {
  private readonly baseUrl = 'https://compute.scb-ncats.io/compute/plugins';
  private httpExternal: HttpClient;

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.httpExternal = new HttpClient(httpBackend);
  }

  getPlugins() {
    return this.http.get<PluginX[]>(this.baseUrl);
  }

  getJsonFromURL(url: string): Observable<JSON> {
    return this.httpExternal.get<JSON>(url);
  }

  postPlugin(pluginDescriptor: any): Observable<any> {
    const httpParams = new HttpParams();
    httpOptions.params = httpParams;
    return this.http.post<any>(this.baseUrl,
      pluginDescriptor,
      httpOptions
    );
  }
}
