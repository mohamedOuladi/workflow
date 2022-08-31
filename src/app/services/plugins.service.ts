import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@labshare/base-ui-services';

@Injectable({
  providedIn: 'root',
})
export class PluginsService {
  private readonly baseUrl = 'https://compute.scb-ncats.io/compute/plugins';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPlugins() {
    const filter = {
      offset: 0,
      limit: 1000,
      skip: 0,
      order: 'string',
      where: {
        additionalProp1: {},
      },
      fields: {
        id: true,
        cwlId: true,
        name: true,
        version: true,
        title: true,
        description: true,
        containerId: true,
        inputs: true,
        outputs: true,
        customInputs: true,
        ui: true,
        author: true,
        institution: true,
        website: true,
        citation: true,
        repository: true,
        baseCommand: true,
        stdout: true,
        stderr: true,
        pluginHardwareRequirements: true,
        cwlScript: true,
      },
    };

    return this.http.get(this.baseUrl, { params: { filter: JSON.stringify(filter) } });
  }
}
