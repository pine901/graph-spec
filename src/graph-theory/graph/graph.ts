import { Parser } from './../parser';
import cytoscape, {
  Core,
} from 'cytoscape'
import { Node } from '../tree/tree.interface'
import { GraphData, IEdge, IGraph, IVertex, Visit } from './graph.interface'

/**
 * (1) Implement IGraph interface
 */
export class Graph implements IGraph<IVertex, IEdge> {
  cy: Core
  bfsData: GraphData
  dfsData: GraphData

  constructor(tree: Node) {
    /**
     * (2) Use Parser interface to parse tree
     */

    this.bfsData = this.parseBfsTree(tree)
    this.dfsData = this.parseDfsTree(tree)
    /**
     * (3) Initialize cytoscape with parsed data
     */
    this.cy = cytoscape()
  }

  parseBfsTree(tree: Node, graph?: GraphData, parent?: Node): GraphData {
    let data = graph || { vertices: [], edges: [] } as GraphData
    let childrenNode: Node[] = [];
    let parentList: Node[] = [];
    data.vertices.push({ id: tree.id, name: tree.name })
    parentList.push(tree);

    do {
      childrenNode = [];
      for (let parentNode of parentList) {
        for (let node of parentNode?.children) {
          childrenNode.push(node);
          data.vertices.push({ id: node.id, name: node.name });
        }
      }
      parentList = childrenNode;

    } while (childrenNode.length != 0);

    return data;
  }

  parseDfsTree(tree: Node, graph?: GraphData, parent?: Node): GraphData {
    const data = graph || { vertices: [], edges: [] } as GraphData
    if (graph === undefined) {
      data.vertices.push({ id: tree.id, name: tree.name })
    }
    for (let i of tree.children.reverse()) {
      data.vertices.push({ id: i.id, name: i.name })
      this.parseDfsTree(i, data)
    }
    return data
  }

  /**
   * (4) Use cytoscape under the hood
   */
  bfs(visit: Visit<IVertex, IEdge>) {
    this.bfsData.vertices.map((i, k) => visit(i, this.bfsData.edges[k]))
    // this.recursiveBfs(this.data, visit)
  }

  /**
   * (5) Use cytoscape under the hood
   */
  dfs(visit: Visit<IVertex, IEdge>) {
    this.dfsData.vertices.map((i, k) => visit(i, this.dfsData.edges[k]))
  }
}
