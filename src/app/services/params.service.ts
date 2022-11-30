import { Injectable } from '@angular/core';
import { NodeX } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  constructor() { }

  addParamsToNode(node: NodeX) {
    // this.inputParams = this.data!.plugin.cwlScript.inputs;
    // this.outputParams = this.data!.plugin.cwlScript.outputs;
    
    for (let inputParam in node.plugin.cwlScript.inputs) {
      console.log(inputParam);
    }
  }

}
