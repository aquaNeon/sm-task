import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;

  #define TAU 6.28318530718
  #define MAX_ITER 5

  void main() {
      float time = iTime * 0.1 + 75.0;
      vec2 uv = vUv;
      vec2 p = mod(uv * TAU, TAU) -200.0;
      vec2 i = vec2(p);
      float c = 1.0;
      float inten = 0.005;

      for (int n = 0; n < MAX_ITER; n++) {
          float t = time * (1.0 - (5.5 / float(n + 1)));
          i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
          c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
      }
      c /= float(MAX_ITER);
      c = 1.17 - pow(c, 1.4);
      vec3 colour = vec3(pow(abs(c), 7.0));
      colour = clamp(colour + vec3(1.0, 0.5, 0.3), 0.0, 1.0);
      gl_FragColor = vec4(colour, 1.0);
  }
`;

export function Loop(props) {
  const { nodes } = useGLTF('/assets/models/infinity_loop2.glb');
  
  const meshRef = useRef();
  const { size } = useThree();
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0.0 },
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
    },
    vertexShader,
    fragmentShader,
  });

  useFrame((state) => {
    const { clock, size } = state;
    shaderMaterial.uniforms.iTime.value = clock.getElapsedTime();
    shaderMaterial.uniforms.iResolution.value.set(size.width, size.height);
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        geometry={nodes.Object_2.geometry}
        material={shaderMaterial}
        position={[0, 1.204, -1.949]}
        rotation={[-Math.PI, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload('/assets/models/infinity_loop2.glb');