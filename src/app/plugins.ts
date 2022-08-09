import { PluginAComponent } from "./components/plugin-a/plugin-a.component";
import { PluginBComponent } from "./components/plugin-b/plugin-b.component";
import { PluginCComponent } from "./components/plugin-c/plugin-c.component";
import { PluginDComponent } from "./components/plugin-d/plugin-d.component";
import { PluginEComponent } from "./components/plugin-e/plugin-e.component";

export const PLUGINS = [
    {
        name: 'Plugin A',
        icon: 'icon-lsi-plugins',
        type: 'plugin-a',
        component: PluginAComponent,
        hasInlet: true,
        hasOutlet: true,
    },
    {
        name: 'Plugin B',
        icon: 'icon-lsi-plugins',
        type: 'plugin-b',
        component: PluginBComponent,
        hasInlet: true,
        hasOutlet: true,
    },
    {
        name: 'No Inlet',
        icon: 'icon-lsi-check-in',
        type: 'plugin-c',
        component: PluginCComponent,
        hasInlet: false,
        hasOutlet: true,
    },
    {
        name: 'No Outlet',
        icon: 'icon-lsi-check-out',
        type: 'plugin-d',
        component: PluginDComponent,
        hasInlet: true,
        hasOutlet: false,
    },
    {
        name: 'Unconnectable',
        icon: 'icon-lsi-form',
        type: 'plugin-e',
        component: PluginEComponent,
        hasInlet: false,
        hasOutlet: false,
    },

];