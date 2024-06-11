import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

// Simple Perlin noise function
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.6;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p = p * 2.0 + shift;
        amplitude *= 0.2;
    }
    return value;
}

void main() {
    vec2 uv = vUv;
    float waveFrequency = 6.0;
    float waveAmplitude = 0.1;

    // Add Perlin noise to the wave function
    float noiseStrength = 1.0;
    float noise = fbm(uv * 3.0 + uTime * 0.5);

    // Create the wave effect with noise
    float wave = sin((uv.x * waveFrequency) + (uTime * 0.5)) * (waveAmplitude + noiseStrength * noise);

    // Calculate the progress of the wave moving down
    float progress = uTime * 0.35;

    // Define colors for the top and bottom parts
    vec3 topColor = vec3(1.0, 0.5, 0.0);
    vec3 bottomColor = vec3(1.0, 0.8, 0.3);

    // Create the sharp transition effect
    float waveLine = step(wave + progress, uv.y);

    // Mix colors based on the wave line position
    vec3 color = mix(topColor, bottomColor, waveLine);

    gl_FragColor = vec4(color, 1.0);
}
`;

const Fluid = () => {
  const shaderMaterialRef = useRef();

  useFrame((state) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      shaderMaterialRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height);
    }
  });

  return (
    <mesh rotation-z={Math.PI} scale={[2, 2, 1]}>
      <planeGeometry args={[3, 2]} />
      <shaderMaterial
        ref={shaderMaterialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0.0 },
          uResolution: { value: new THREE.Vector2(0, 0) }
        }}
        transparent={true}
      />
    </mesh>
  );
};

export default Fluid;