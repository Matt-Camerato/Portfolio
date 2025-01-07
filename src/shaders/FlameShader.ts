//The Lonely Candle: https://codepen.io/prisoner849/pen/XPVGLp

export const FlameShader = {
  vertexShader: /* glsl*/ `
    uniform float uTime;
    varying vec2 vUv;
    varying float hValue;

    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f*f*(3.0-2.0*f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    void main() {
      vUv = uv;
      vec3 pos = position;

      pos *= vec3(0.8, 2, 0.725);
      hValue = position.y;
      //float sinT = sin(uTime * 2.) * 0.5 + 0.5;
      float posXZlen = length(position.xz);

      pos.y *= 1. + (cos((posXZlen + 0.25) * 3.1415926) * 0.25 + noise(vec2(0, uTime)) * 0.125 + noise(vec2(position.x + uTime, position.z + uTime)) * 0.5) * position.y; // flame height

      pos.x += noise(vec2(uTime * 2., (position.y - uTime) * 4.0)) * hValue * 0.0312; // flame trembling
      pos.z += noise(vec2((position.y - uTime) * 4.0, uTime * 2.)) * hValue * 0.0312; // flame trembling

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
  fragmentShader: /* glsl*/ `
    varying float hValue;
    varying vec2 vUv;

    vec3 heatmapGradient(float t) {
      return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
    }

    void main() {
      float v = abs(smoothstep(0.0, 0.4, hValue) - 1.);
      float alpha = (1. - v) * 0.99; // bottom transparency
      alpha -= 1. - smoothstep(1.0, 0.97, hValue); // tip transparency
      gl_FragColor = vec4(heatmapGradient(smoothstep(0.0, 0.3, hValue)) * vec3(0.95,0.95,0.4), alpha) ;
      gl_FragColor.rgb = mix(vec3(0,0,1), gl_FragColor.rgb, smoothstep(0.0, 0.3, hValue)); // blueish for bottom
      gl_FragColor.rgb += vec3(1, 0.9, 0.5) * (1.25 - vUv.y); // make the midst brighter
      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.66, 0.32, 0.03), smoothstep(0.95, 1., hValue)); // tip
    }
  `,
};
