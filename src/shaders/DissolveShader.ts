import { patchShaders } from "gl-noise";

export const DissolveShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: patchShaders(/* glsl */ `
    uniform sampler2D uTexture;
    uniform vec3 uBorderColor;
    uniform float uThickness;
    uniform float uProgress;
    varying vec2 vUv;

    void main() {
      gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);
      float noise = gln_sfbm(vUv, opts);
      noise = gln_normalize(noise);

      float alpha = step(1.0 - uProgress, noise);
      float border = step((1.0 - uProgress) - uThickness, noise) - alpha;

      vec4 textureColor = texture2D(uTexture, vUv);
      gl_FragColor.a = (alpha + border) * textureColor.a;
      gl_FragColor.rgb = mix(textureColor.rgb, uBorderColor, border);
    }
  `) as string,
};

export const DissolveColorShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: patchShaders(/* glsl */ `
    uniform vec3 uColor;
    uniform vec3 uBorderColor;
    uniform float uThickness;
    uniform float uProgress;
    varying vec2 vUv;

    void main() {
      gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);
      float noise = gln_sfbm(vUv, opts);
      noise = gln_normalize(noise);

      float alpha = step(1.0 - uProgress, noise);
      float border = step((1.0 - uProgress) - uThickness, noise) - alpha;

      gl_FragColor.a = alpha + border;
      gl_FragColor.rgb = mix(uColor, uBorderColor, border);
    }
  `) as string,
};
