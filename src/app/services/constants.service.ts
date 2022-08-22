import { InjectionToken } from "@angular/core";

export interface Config {
    linkTopOffset: number;
}
export const CONST = new InjectionToken<Config>('CONST', {
    providedIn: 'root',
    factory: (): Config => {
        return {
            linkTopOffset: 27
        }
    }
});
