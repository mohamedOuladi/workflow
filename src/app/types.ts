export interface PluginX {
    x: number;
    y: number;
    id?: number;
    type: string;
}

export interface ConnectionX {
    sourceId: number;
    targetId?: number;
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}