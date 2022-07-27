import { PluginAComponent } from "./components/plugin-a/plugin-a.component";
import { PluginBComponent } from "./components/plugin-b/plugin-b.component";

export const PLUGINS = [
    {
        name: 'Plugin A',
        icon: 'icon-lsi-plugins',
        type: 'plugin-a',
        component: PluginAComponent,
    },
    {
        name: 'Plugin B',
        icon: 'icon-lsi-plugins',
        type: 'plugin-b',
        component: PluginBComponent,
    }
];