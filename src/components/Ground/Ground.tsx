import { usePlane } from "@react-three/cannon";
import { MeshReflectorMaterial } from "@react-three/drei";
import { MeshReflectorMaterial as IMeshReflectorMaterial } from "@react-three/drei/materials/MeshReflectorMaterial";
import { useMemo, useRef } from "react";
import { PlaneGeometry } from "three";

const Ground = () => {
    const meshRef = useRef<IMeshReflectorMaterial>(null);
    const sound = useMemo(() => new Audio("/bells.mp3"), []);
    sound.volume = 1;

    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -1.5, 0],
    }));

    return (
        <mesh
            ref={ref as React.MutableRefObject<THREE.Mesh<PlaneGeometry, IMeshReflectorMaterial>>}
            position={[0, -1.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[500, 500]} />
            <MeshReflectorMaterial
                ref={meshRef}
                blur={[1000, 100]}
                resolution={1200}
                mixBlur={5}
                mixStrength={5}
                depthScale={1}
                minDepthThreshold={0.85}
                color="#101425"
                metalness={0.5}
                roughness={0.02}
                mirror={1}
            />
        </mesh>
    );
};

export default Ground;
