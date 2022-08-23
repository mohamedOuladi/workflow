import { InjectionToken } from '@angular/core';

export interface Config {
  linkTopOffset: number;
  duplicateOffset: number;
}
export const CONST = new InjectionToken<Config>('CONST', {
  providedIn: 'root',
  factory: (): Config => {
    return {
      linkTopOffset: 27,
      duplicateOffset: 50,
    };
  },
});
