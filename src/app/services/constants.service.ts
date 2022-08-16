import { InjectionToken } from "@angular/core";

export interface Config {
    linkYOffset: number;
}
export const CONST = new InjectionToken<Config>('CONST', {
    providedIn: 'root',
    factory: (): Config => {
        return {
            linkYOffset: 27
        }
    }
});
