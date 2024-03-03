import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Cylinder from './Components/Cylinder';

import Header from './Components/Header';
import RtCalc from './Components/RtCalc';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="wrapper">
        <RtCalc />

        <Canvas shadows id="canvas" style={{ border: '2px solid black', width: '', height: '' }}>
          <OrbitControls enableZoom={true} />

          {/* <Stars /> */}
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 15, 10]} angle={0.3} />
          <directionalLight position={[-2, 5, 2]} intensity={1} />
          <Suspense fallback={null}>
            <Cylinder />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default App;
