export interface NodeX {
    x: number;
    y: number;
    id?: number;
    type: string;
    width?: number;
    height?: number;
}

export interface Link {
    sourceId: number;
    targetId?: number;
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}