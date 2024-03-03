import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { TextureLoader } from 'three';
import metalicTexture from '../Image/metalicTexture.jpg';
import { MeshWobbleMaterial, PerspectiveCamera } from '@react-three/drei';
import { useSelector } from 'react-redux';


export default function Cylinder() {
  const dia = useSelector((state) => state.rtParams.dia);
  const thick = useSelector((state) => state.rtParams.thick);
  const focus = useSelector((state) => state.rtParams.focus);
  const type = useSelector((state) => state.rtParams.type);
  const iqi = useSelector((state) => state.rtParams.iqi);
  const ug = useSelector((state) => state.rtParams.ug);
  const cap = useSelector((state) => state.rtParams.cap);
  const diaMM = useSelector((state) => state.rtParams.diaMM);

  const [isWireframe, setIsWireframe] = useState(false)
  const [tubeIn, setTubeIn] = useState(0.7)
  const [tubeOut, setTubeOut] = useState(dia)
  const [tubeCover1, setCover1] = useState(0.9)
  const [tubeCover2, setCover2] = useState(0.9)

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
      if (shouldHover) ref.current.rotation.y += delta*0.5;
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

  useEffect(()=>{
    setTubeOut(diaMM*0.005)
    setTubeIn((diaMM-thick)*0.005)

  },[dia, thick, cap, type])



  return (
    <>
     <PerspectiveCamera makeDefault position={[dia+5, 9, 10]} />
    <mesh ref={ref} onDoubleClick={(e) => setIsWireframe(!isWireframe)} ondo
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
      <mesh  rotation={[0, 0, 0  ]} position={[0, -1.1, 
        // -0.5+focus/25.4/(dia+cap)
        // (type=='DWSI')?(tubeOut*1.13+cap*0.015):
        (tubeOut*1.13)+(focus-diaMM+cap)*0.012
        // -focus*0.005-(tubeOut*1.13+cap*0.015)
        ]} scale={0.5} > 
        <capsuleGeometry attach={'geometry'} args={[0.1, 5]} />
        <meshStandardMaterial color={'gold'} side={2}/>
      </mesh>

      {/* SOURCE */}
      <mesh rotation={[0, 0, 0  ]} position={[0, -1.35, (tubeOut*1.13)+(focus-diaMM+cap)*0.012]} scale={0.5} >
        <capsuleGeometry attach={'geometry'} args={[0.1, 5]} />
        <meshStandardMaterial color={'red'} side={2} />
        
      </mesh>


      <mesh scale={1}>
        {/* FILM */}
      <mesh rotation={[1.6, 0, 0  ]} position={[0, 0.1, -(tubeOut*1.13+cap*0.015)-(diaMM-diaMM+cap/10)*0.03]} scale={1}>
        <boxGeometry attach={'geometry'} args={[0.6, 0.13, Math.sqrt(dia/2), 20, 20, true]} />
        <meshStandardMaterial color={"white"} wireframe={isWireframe}/>
      </mesh>

      {/* TUBE out */}
      <mesh rotation={[0, 0, +Math.PI / 2]} position={[0, 0, 0]} scale={1.1}>
        <cylinderGeometry attach={'geometry'} args={[tubeOut, tubeOut, 4, 100, 20, true]} />
        <meshStandardMaterial map={colorMap}  side={2} wireframe={isWireframe}/>
      </mesh>

      {/* TUBE CAP out */}
      <mesh rotation={[4, 0, +Math.PI / 2]} position={[0, 0, 0]} scale={1.1}>
        <cylinderGeometry attach={'geometry'} args={[tubeOut+tubeOut*0.007, tubeOut+tubeOut*0.007, 0.5, 100, 20, true]} />
        <meshStandardMaterial map={colorMap} side={2} wireframe={isWireframe}/>
      </mesh>
      

      {/* TUBE in */}
      <mesh rotation={[0, 0, +Math.PI / 2]} position={[0, 0, 0]} scale={1.1}>
        <cylinderGeometry attach={'geometry'} args={[tubeIn, tubeIn, 4, 100, 20, true]} />
        <meshStandardMaterial map={colorMap} color={'grey'}  side={2} wireframe={isWireframe}/>
      </mesh>

      {/* CAP */}
     {!cap?null:<mesh rotation={[4, Math.PI / 2, 0]} position={[0, 0, 0]}>
        <torusGeometry attach={'geometry'} args={[
          tubeOut*1.1, 
          cap*0.015,
          30, 
          200, 
          7]} />
        <meshStandardMaterial map={colorMap} wireframe={isWireframe} />
      </mesh>}


          
      {/* SIDE COVER */}
      <mesh rotation={[4, Math.PI / 2, 0]} position={[2.2, 0, 0]}>
        <ringGeometry attach={'geometry'}  args={[tubeIn + tubeIn*0.1, tubeOut+tubeOut*0.12, 100]}/>
        <meshStandardMaterial map={colorMap} side={2} />
      </mesh>

      <mesh rotation={[2, Math.PI / 2, 0]} position={[-2.2, 0, 0]}>
        <ringGeometry attach={'geometry'}  args={[tubeIn + tubeIn*0.1, tubeOut+tubeOut*0.12, 100]}/>
        <meshStandardMaterial map={colorMap} side={2}/>
      </mesh>

        {/* LIGHT */}
      <mesh rotation={[ +Math.PI / 2, 0, 0]} position={[0, 0 , 
      (tubeOut*1.13)+(focus-diaMM+cap)*0.012-(Math.sqrt(focus)*0.55)  
      ]} scale={1.1}>
        <cylinderGeometry attach={'geometry'} args={[0, 
           (Math.sqrt(focus)*0.2),
          (Math.sqrt(focus)),
          100, 10, false]} />

        <MeshWobbleMaterial factor={7} speed={0.5} side={2} color={'yellow'} wireframe={false} transparent={true} opacity={0.08}/>
      </mesh>

  



      
    
    </mesh>
    </mesh>
    </>
  );
}
