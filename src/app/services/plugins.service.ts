import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PluginsService {

  baseUrl = 'https://compute.scb-ncats.io/compute/plugins';
  // -H 'accept: application/json' \
  // -H 'Authorization: Bearer
  token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCIsImtpZCI6ImFKZzRBNEtUSHQ3N1FsM3lQLTR4Wm93WS1JR0hGTWc2VUI0X3NBa2QwQ1kifQ.eyJhenAiOjQ3OCwiZ3R5IjoiYXV0aG9yaXphdGlvbl9jb2RlIiwib3JnLmxhYnNoYXJlLnRlbmFudC5uYW1lIjoicG9sdXMtcWEiLCJvcmcubGFic2hhcmUudGVuYW50LmlkIjoyNjgsImp0aSI6IjhBVl9rYzRXaVd3ajFWUEJ3WFRYeiIsInN1YiI6IjEwNzY5IiwiaWF0IjoxNjYxODc4MDgzLCJleHAiOjE2NjE4ODE2ODMsInNjb3BlIjoiIiwiY2xpZW50X2lkIjoiYXV0aC11aSIsImlzcyI6Imh0dHBzOi8vYS1xYS5sYWJzaGFyZS5vcmcvX2F1dGgvdlRlc3QvYXV0aC9wb2x1cy1xYSIsImF1ZCI6Imh0dHBzOi8vYS1xYS5sYWJzaGFyZS5vcmcvX2F1dGgvdlRlc3QvYXV0aC9wb2x1cy1xYSJ9.f1oumUeIo0OMx9yiCOtAlpTKSqR0jgjKfa-gIyDcR6ifPZ9EKKsFAhBiXbxtTImgZbiA5GlZrFfvJu5C-UzLHKPLb5idJ-P7x_sTiXWY7fPKFCNgE8PO8LU5ur-iyrDpezMJOeEx3zF2MVTAZ7qjRpvBjQdorjvBZK94dwG8OUAxlxSMHXU2cQ-d4DElYS1G11q8Lal5HjG4j5IrPUnqBb2CgZb-mEr_sXGxnV0CJlPLeuRv8HEHu1imuF5tBw-RZb9Mum1F_K9tb3ytjuNznJnB7bynBa9oBJQou0YFrTJVBYG8m8kzjnXlbtAkR1a0vcfDzlqFWuPzU21p5ql7FA';

  constructor(private http: HttpClient) { }

  getPlugins() {
    const filter = {
      "offset": 0,
      "limit": 1000,
      "skip": 0,
      "order": "string",
      "where": {
        "additionalProp1": {}
      },
      "fields": {
        "id": true,
        "cwlId": true,
        "name": true,
        "version": true,
        "title": true,
        "description": true,
        "containerId": true,
        "inputs": true,
        "outputs": true,
        "customInputs": true,
        "ui": true,
        "author": true,
        "institution": true,
        "website": true,
        "citation": true,
        "repository": true,
        "baseCommand": true,
        "stdout": true,
        "stderr": true,
        "pluginHardwareRequirements": true,
        "cwlScript": true
      }
    }


    return this.http.get(this.baseUrl, { params: { filter: JSON.stringify(filter) }, headers: { 'Authorization': 'Bearer ' + this.token } });
  }

}
