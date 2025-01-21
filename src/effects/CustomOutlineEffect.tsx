import * as THREE from "three";
import { Effect, Resolution, Selection } from "postprocessing";
import {
  surfaceIdMaterial,
  outlineFragmentShader,
} from "../shaders/CustomOutlineShader";

export class CustomOutlineEffect extends Effect {
  public selection: Selection;

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private resolution: THREE.Vector2;

  private surfaceBuffer: THREE.WebGLRenderTarget;
  private surfaceIdOverrideMaterial: THREE.ShaderMaterial;

  private surfaceId: number = 0;
  private hasAssignedIds: boolean = false;

  /**
   * Constructs my custom outline effect that draws ALL edges instead of just the outer edges.
   *
   * @param {Scene} scene - The main scene.
   * @param {Camera} camera - The main camera.
   * @param {Object} [options] - The options.
   * @param {String} [options.outlineColor="black"] - The color of visible edges.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - The vertical resolution.
   */

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    {
      outlineColor = "black",
      width = Resolution.AUTO_SIZE,
      height = Resolution.AUTO_SIZE,
    } = {}
  ) {
    super("CustomOutlineEffect", outlineFragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["sceneColorBuffer", new THREE.Uniform(null)],
        ["depthBuffer", new THREE.Uniform(null)],
        ["surfaceBuffer", new THREE.Uniform(null)],
        ["outlineColor", new THREE.Uniform(new THREE.Color(outlineColor))],
        ["multiplierParameters", new THREE.Uniform(new THREE.Vector2(0.7, 20))],
      ]),
    });

    this.scene = scene;
    this.camera = camera;
    this.resolution = new THREE.Vector2(width, height);

    //create a buffer to store the surface ids
    this.surfaceBuffer = new THREE.WebGLRenderTarget(
      this.resolution.x,
      this.resolution.y,
      {
        depthBuffer: true,
        depthTexture: new THREE.DepthTexture(
          this.resolution.x,
          this.resolution.y
        ),
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        generateMipmaps: false,
        stencilBuffer: false,
      }
    );
    this.surfaceIdOverrideMaterial = surfaceIdMaterial;

    this.selection = new Selection();
  }

  private assignSurfaceIds() {
    this.surfaceId = 0;

    this.selection.forEach((node) => {
      if (node instanceof THREE.Mesh) {
        const colorsTypedArray = this.getSurfaceIdAttribute(node);
        node.geometry.setAttribute(
          "surfaceId",
          new THREE.BufferAttribute(colorsTypedArray, 1)
        );
      }
    });
    this.surfaceIdOverrideMaterial.uniforms.maxSurfaceId.value =
      this.surfaceId + 1;
    //console.log(this.surfaceIdOverrideMaterial.uniforms.maxSurfaceId.value);
  }

  private getSurfaceIdAttribute(mesh: THREE.Mesh) {
    const bufferGeometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = bufferGeometry.getAttribute("position");
    const numVertices = positionAttribute.count;
    const vertexIdToSurfaceId = this.generateSurfaceIds(mesh);

    const colors = [];
    for (var i = 0; i < numVertices; i++) {
      const vertexId = i;
      var surfaceId = vertexIdToSurfaceId[vertexId];
      colors.push(surfaceId);
    }

    const colorsTypedArray = new Float32Array(colors);
    return colorsTypedArray;
  }

  private generateSurfaceIds(mesh: THREE.Mesh): Record<number, number> {
    const bufferGeometry = mesh.geometry as THREE.BufferGeometry;
    const numIndices = bufferGeometry.index?.count ?? 0;
    const indexBuffer = bufferGeometry.index?.array ?? [];

    const vertexMap: Record<number, number[]> = {};
    for (var i = 0; i < numIndices; i += 3) {
      const i1 = indexBuffer[i + 0];
      const i2 = indexBuffer[i + 1];
      const i3 = indexBuffer[i + 2];

      add(i1, i2);
      add(i1, i3);
      add(i2, i3);
    }

    function add(a: number, b: number) {
      if (vertexMap[a] == undefined) vertexMap[a] = [];
      if (vertexMap[b] == undefined) vertexMap[b] = [];

      if (vertexMap[a].indexOf(b) == -1) vertexMap[a].push(b);
      if (vertexMap[b].indexOf(a) == -1) vertexMap[b].push(a);
    }

    const frontierNodes = Object.keys(vertexMap).map((v) => Number(v));
    const exploredNodes: Record<number, boolean> = {};
    const vertexIdToSurfaceId: Record<number, number> = {};

    while (frontierNodes.length > 0) {
      const node = frontierNodes.pop()!;
      if (exploredNodes[node]) continue;
      const surfaceVertices = getNeighborsNonRecursive(node);
      for (var v of surfaceVertices) {
        exploredNodes[v] = true;
        vertexIdToSurfaceId[v] = this.surfaceId;
      }
      this.surfaceId++;
    }

    function getNeighborsNonRecursive(node: number) {
      const frontier = [node];
      const explored: Record<number, boolean> = {};
      const result = [];

      while (frontier.length > 0) {
        const currentNode = frontier.pop()!;
        if (explored[currentNode]) continue;
        const neighbors = vertexMap[currentNode];
        result.push(currentNode);
        explored[currentNode] = true;
        for (var n of neighbors) {
          if (!explored[n]) frontier.push(n);
        }
      }
      return result;
    }

    return vertexIdToSurfaceId;
  }

  update(renderer: THREE.WebGLRenderer, inputBuffer: THREE.WebGLRenderTarget) {
    //if no objects are selected, do nothing
    if (this.selection.size === 0) return;

    //assign surface ids ONCE when given selected objects
    if (!this.hasAssignedIds) {
      this.assignSurfaceIds();
      this.hasAssignedIds = true;
      return;
    }

    this.camera.layers.set(this.selection.layer);

    renderer.setRenderTarget(this.surfaceBuffer);
    const initialOverrideMaterial = this.scene.overrideMaterial;

    this.scene.overrideMaterial = this.surfaceIdOverrideMaterial;
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = initialOverrideMaterial;

    this.camera.layers.enableAll();

    this.uniforms.get("sceneColorBuffer")!.value = inputBuffer.texture;
    this.uniforms.get("depthBuffer")!.value = this.surfaceBuffer.depthTexture;
    this.uniforms.get("surfaceBuffer")!.value = this.surfaceBuffer.texture;
  }

  setSize(width: number, height: number) {
    this.surfaceBuffer.setSize(width, height);
    this.resolution.set(width, height);
  }
}
