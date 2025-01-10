import * as THREE from "three";
import { DissolveShader, DissolveColorShader } from "../shaders/DissolveShader";

const gradientMap = new THREE.TextureLoader().load("/textures/threeTone.jpg");
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;

export const createToonMaterial = (baseColor: string) => {
  const material = new THREE.MeshToonMaterial({
    color: baseColor,
    gradientMap: gradientMap,
  });

  return material;
};

export const createTransparentMaterial = (color: string, opacity: number) => {
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity,
    depthWrite: false,
  });
  return material;
};

export function DissolveMaterial(
  texture: THREE.Texture,
  borderColor: string,
  progress: number
) {
  const uniforms = {
    uTexture: { value: texture },
    uBorderColor: { value: new THREE.Color(borderColor) },
    uThickness: { value: 0.02 },
    uProgress: { value: progress },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: DissolveShader.vertexShader,
    fragmentShader: DissolveShader.fragmentShader,
    toneMapped: false,
    transparent: true,
  });

  return material;
}

export function DissolveColorMaterial(
  color: string,
  borderColor: string,
  progress: number
) {
  const uniforms = {
    uColor: { value: new THREE.Color(color) },
    uBorderColor: { value: new THREE.Color(borderColor) },
    uThickness: { value: 0.02 },
    uProgress: { value: progress },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: DissolveColorShader.vertexShader,
    fragmentShader: DissolveColorShader.fragmentShader,
    toneMapped: false,
    transparent: true,
  });

  return material;
}
