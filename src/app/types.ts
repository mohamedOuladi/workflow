export interface PluginX {
    name: string;
    x: number;
    y: number;
    id?: number;
}

export interface ConnectionX {
    sourceId?: number;
    targetId?: number;
    id?: number;
}