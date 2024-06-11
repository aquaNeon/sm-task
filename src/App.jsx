import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import './index.css'
import { OrbitControls, Stage } from '@react-three/drei';

function App() {

  return (
      <div className="App">
        <Canvas>
          <Experience />
        </Canvas>
      </div>
  )
}

export default App;