import { InjectionToken } from '@angular/core';

export interface Constants {
  linkTopOffset: number;
  duplicateOffset: number;
  nodeWidth: number,
}
export const CONST = new InjectionToken<Constants>('CONST', {
  providedIn: 'root',
  factory: (): Constants => {
    return {
      linkTopOffset: 27,
      duplicateOffset: 50,
      nodeWidth: 250,
    };
  },
});
