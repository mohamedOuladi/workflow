export interface NodeX {
    x: number;
    y: number;
    id?: number;
    type: string;
    selected?: boolean;
    name: string;
    expanded?: boolean;
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