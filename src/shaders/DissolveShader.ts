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

    vec3 rgb2hsv(vec3 c) {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);
      float noise = gln_sfbm(vUv, opts);
      noise = gln_normalize(noise);

      float alpha = step(1.0 - uProgress, noise);
      float border = step((1.0 - uProgress) - uThickness, noise) - alpha;

      vec4 textureColor = texture2D(uTexture, vUv);
      vec3 hsv = rgb2hsv(textureColor.rgb);
      
      hsv.y *= 1.5;
      hsv.z *= 0.3;
      vec3 rgb = hsv2rgb(hsv);
      
      gl_FragColor.a = (alpha + border) * textureColor.a;
      gl_FragColor.rgb = mix(rgb, uBorderColor, border);
    }
  `) as string,
};
