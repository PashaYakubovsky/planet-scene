import * as THREE from "three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
    nodes: {
        group1022280760: THREE.Mesh;
    };
    materials: {
        mat24: THREE.MeshStandardMaterial;
    };
};

const Diamond = (props: JSX.IntrinsicElements["group"]) => {
    const ref = useRef<THREE.Group>(null);
    const { nodes, materials } = useGLTF("/diamond.glb") as GLTFResult;

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.001;
            ref.current.rotation.x += 0.001;
            ref.current.rotation.z += 0.001;
        }
    });
    return (
        <group ref={ref} {...props} dispose={null}>
            <mesh geometry={nodes.group1022280760.geometry} material={materials.mat24} />
        </group>
    );
};

export default Diamond;

useGLTF.preload("/diamond.glb");
