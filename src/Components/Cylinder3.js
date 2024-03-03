import { useFrame, useLoader } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { BoxGeometry, PlaneGeometry, TextureLoader } from 'three';
import metalicTexture from '../Image/metalicTexture.jpg';
import { MeshWobbleMaterial, PerspectiveCamera } from '@react-three/drei';
import { useDispatch, useSelector } from 'react-redux';


export default function Cylinder() {
  const dia = useSelector((state) => state.rtParams.dia);
  const thick = useSelector((state) => state.rtParams.thick);
  const focus = useSelector((state) => state.rtParams.focus);
  const type = useSelector((state) => state.rtParams.type);
  const iqi = useSelector((state) => state.rtParams.iqi);
  const ug = useSelector((state) => state.rtParams.ug);
  const cap = useSelector((state) => state.rtParams.cap);
  const diaMM = useSelector((state) => state.rtParams.diaMM);

  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [shouldHover, setShouldHover] = useState(true)
  const timer = useRef(null)

  const colorMap = useLoader(TextureLoader, metalicTexture);
  const ref = useRef();

  // useFrame((state,delta)=> {
  //   if(!isHovered && !isClicked) ref.current.rotation.y += delta*0.5;
  // })

  useFrame((state, delta)=>{
      // if (shouldHover) ref.current.rotation.y += delta*0.5;
  })

  useEffect(() => {
    if (isHovered || isClicked) {
      if (timer.current) clearTimeout(timer.current)
      setShouldHover(false)
    } else if (!isHovered && !isClicked) {
      if (timer.current) clearTimeout(timer.current)
      
      timer.current = setTimeout(() => {
        setShouldHover(true)
      }, 1000)
    }
  }, [isHovered, isClicked])



  return (
    <>
     <PerspectiveCamera makeDefault position={[8, 9, 2]} />
    <mesh ref={ref} 
          onPointerDown={(e)=>{
            e.stopPropagation()
            setIsClicked(true)
          }}
          onPointerOver={(e)=>{
            e.stopPropagation()
            setIsHovered(true)
          }}
          onPointerOut={(e)=>{
            e.stopPropagation()
            setIsHovered(false)
          }}
          
          onPointerUp={(e)=> {
            e.stopPropagation()
            setIsClicked(false)
          }}>

    

      {/* SOURCE cap */}
      <mesh  rotation={[0, 0, 0  ]} position={[1, -0.6, 0.5]} scale={0.5} > 
        <capsuleGeometry attach={'geometry'} args={[0.1, 3]} />
        <meshStandardMaterial color={'gold'} side={'dobleside'}/>
      </mesh>

      {/* SOURCE */}
      <mesh rotation={[0, 0, 0  ]} position={[1, -0.85, -0.5+focus/(diaMM+cap)]} scale={0.5} >
        <capsuleGeometry attach={'geometry'} args={[0.1, 3]} />
        <meshStandardMaterial color={'red'} side={'dobleside'}/>
        
      </mesh>


      <mesh scale={1}>
        {/* FILM */}
      <mesh rotation={[1.6, 0, 0  ]} position={[1, 0.1, -1.2]} scale={1}>
        <boxGeometry attach={'geometry'} args={[0.8, 0.13, 1, 20, 20, true]} />
        <meshStandardMaterial color={"white"} />
      </mesh>

      {/* TUBE */}
      <mesh rotation={[0, 0, +Math.PI / 2]} position={[1, 0, 0]} scale={1.1}>
        <cylinderGeometry attach={'geometry'} args={[1, 1, 4, 20, 20, true]} />
        <meshStandardMaterial map={colorMap}  />
      </mesh>

      {/* CAP */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[1, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[1, 0.2, 30, 200, 7]} />
        <meshStandardMaterial map={colorMap} />
      </mesh>
      {/* INSIDE */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-1.1, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.9, 0.2, , 200, 7]} />
         <meshStandardMaterial map={colorMap} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-1, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.9, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.5, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.2, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-0, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.2, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.5, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.8, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[1.2, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[1.5, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[1.8, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[2.1, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[2.4, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[2.7, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap}color={'grey'} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[3, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.8, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} color={'grey'}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[3.1, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[0.9, 0.2, , 200, 7]} />
        <meshStandardMaterial map={colorMap} />
      </mesh>
    
    </mesh>
    </mesh>
    </>
  );
}
