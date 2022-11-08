// add param class 
// each node has a list of params
// in the ui, add list of params to node (dropodown) and create anchor points for each param
// next step is to create ParamLink between 2 params
export interface NodeX {
  x: number;
  y: number;
  id?: number;
  selected?: boolean;
  name: string;
  expanded?: boolean;
  hasOutlet?: boolean;
  hasInlet?: boolean;
  width?: number;
  settings?: any;
  plugin: PluginX;
  // params?: Param[];
}

export interface Param {
  id: number;
  name: string;
  hasInlet: boolean;
  hasOutlet: boolean; 
}

export interface ParamLink {
  id: number;
  sourceParamId: number;
  targetParamId: number;
  sourceNodeId: number;
  targetNodeId: number;
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

export interface State {
  nodes: NodeX[];
  links: Link[];
  selection: number[];
}

export interface PluginX {
  id: string;
  name: string;
  version: string;
  title: string;
  description: string;
  containerId: string;
  inputs: Array<{
    name: string;
    type: string;
    label: string;
    required: boolean;
  }>;
  outputs: Array<{
    name: string;
    type: string;
    label: string;
  }>;
  ui: Array<{
    key: string;
    title: string;
    description: string;
    type: string;
  }>;
  author: string;
  institution: string;
  website: string;
  citation: string;
  baseCommand: Array<string>;
  pluginHardwareRequirements: {
    [key: string]: any;
  }
  cwlScript: any

}

export interface Workflow {
  id: string;
  name: string;
  driver: string;
  inputs: any;
  outputs: any;
  steps: any;
  cwlJobInputs: any;
  status: string,
  dateCreated: Date,
  dateFinished: Date,
  owner: string
}

// export interface Step {
//   in: {
//     stepName: string;
//   }
// }
