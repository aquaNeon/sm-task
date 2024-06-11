// ./components/Experience.jsx

import React from 'react';
import { Loop } from './Loop';
import Scratch from './Scratch';
import Fluid from './Fluid';

const Experience = () => {
  return (
    <>
      <group rotation-y={ Math.PI }>
        <Scratch />
        <Loop scale={0.01}/>
      </group>
      <group position-z={-1}scale={4}>
        <Fluid />
      </group>
    </>
  );
};

export default Experience;