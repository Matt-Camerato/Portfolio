import * as THREE from "three";

export const surfaceIdMaterial = new THREE.ShaderMaterial({
  uniforms: {
    maxSurfaceId: { value: 1 },
  },
  vertexShader: /* glsl */ `
    attribute float surfaceId;

    varying vec2 v_uv;
    varying float vSurfaceId;

    void main() {
      v_uv = uv;
      vSurfaceId = surfaceId;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 v_uv;
    varying float vSurfaceId;
    uniform float maxSurfaceId;

    void main() {
      float surfaceId = round(vSurfaceId) / maxSurfaceId;
      gl_FragColor = vec4(surfaceId, 0.0, 0.0, 1.0);
    }
  `,
  vertexColors: true,
});

export const outlineFragmentShader = /* glsl */ `
  uniform sampler2D sceneColorBuffer;
  uniform sampler2D depthBuffer;
  uniform sampler2D surfaceBuffer;
  uniform float cameraNear;
  uniform float cameraFar;
  uniform vec4 screenSize;
  uniform vec3 outlineColor;
  uniform vec2 multiplierParameters;

  varying vec2 vUv;

  float readDepth (sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = texture2D(depthSampler, coord).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
  }

  float getPixelDepth(int x, int y) {
    return readDepth(depthBuffer, vUv + screenSize.zw * vec2(x, y));
  }

  vec3 getSurfaceValue(int x, int y) {
    vec3 val = texture2D(surfaceBuffer, vUv + screenSize.zw * vec2(x, y)).rgb;
    return val;
  }

  float saturateValue(float num) {
    return clamp(num, 0.0, 1.0);
  }

  float getSurfaceIdDiff(vec3 surfaceValue) {
    float surfaceIdDiff = 0.0;
    surfaceIdDiff += distance(surfaceValue, getSurfaceValue(1, 0));
    surfaceIdDiff += distance(surfaceValue, getSurfaceValue(-1, 0));
    surfaceIdDiff += distance(surfaceValue, getSurfaceValue(0, 1));
    surfaceIdDiff += distance(surfaceValue, getSurfaceValue(0, -1));

    return surfaceIdDiff;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 sceneColor = texture2D(sceneColorBuffer, vUv);
    float depth = getPixelDepth(0, 0);
    vec3 surfaceValue = getSurfaceValue(0, 0);

    float depthDiff = 0.0;
    depthDiff += abs(depth - getPixelDepth(1, 0));
    depthDiff += abs(depth - getPixelDepth(0, 1));
    depthDiff += abs(depth - getPixelDepth(0, 1));
    depthDiff += abs(depth - getPixelDepth(0, -1));

    float surfaceValueDiff = getSurfaceIdDiff(surfaceValue);

    float depthBias = multiplierParameters.x;
    float depthMultiplier = multiplierParameters.y;

    depthDiff = depthDiff * depthMultiplier;
    depthDiff = saturateValue(depthDiff);
    depthDiff = pow(depthDiff, depthBias);
    depthDiff = depthDiff * 100.0;

    if (surfaceValueDiff != 0.0) surfaceValueDiff = surfaceValueDiff * 350.0;

    float surfaceValueThreshold = 0.35;
    if (surfaceValueDiff < surfaceValueThreshold) surfaceValueDiff = 0.0;

    float outline = saturateValue(surfaceValueDiff + depthDiff);

    vec4 outlineColor = vec4(outlineColor, 1.0);
    outputColor = vec4(mix(sceneColor, outlineColor, outline));
  }
`;
