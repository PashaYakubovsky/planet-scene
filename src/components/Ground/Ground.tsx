import { MeshReflectorMaterial } from "@react-three/drei";

const Ground = () => {
    return (
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[500, 500]} />
            <MeshReflectorMaterial
                blur={[1000, 100]}
                resolution={720}
                mixBlur={5}
                mixStrength={5}
                depthScale={1}
                minDepthThreshold={0.85}
                color="#fff"
                metalness={0.5}
                roughness={0.02}
                mirror={1}
            />
        </mesh>
    );
};

export default Ground;
