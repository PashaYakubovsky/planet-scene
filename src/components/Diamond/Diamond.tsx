import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Vector3, useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";

type GLTFResult = GLTF & {
    nodes: {
        group1022280760: THREE.Mesh;
    };
    materials: {
        mat24: THREE.MeshStandardMaterial;
    };
};

const textureLoader = new THREE.TextureLoader();

const Diamond = (props: JSX.IntrinsicElements["group"]) => {
    const ref = useRef<THREE.Group>(null);
    const { nodes, materials } = useGLTF("/diamond.glb") as GLTFResult;

    useEffect(() => {
        const colorTexture = textureLoader.load("/10.png");
        colorTexture.mapping = THREE.EquirectangularReflectionMapping;

        if (materials.mat24) {
            materials.mat24.map = colorTexture;
            materials.mat24.envMapIntensity = 0.2;
            materials.mat24.transparent = true;
            materials.mat24.roughness = 0.3;
            materials.mat24.metalness = 0.9;
        }
    }, [materials.mat24]);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.001;
            ref.current.rotation.x += 0.001;
            ref.current.rotation.z += 0.001;
        }
    });

    // Animate the position when hovering over the box
    const [springProps, setSpringProps] = useSpring(() => ({
        rotation: [0, 0, 0],
        ease: { tension: 100, friction: 30 },
    }));

    return (
        <group ref={ref} {...props} dispose={null}>
            <animated.mesh
                onPointerEnter={() => setSpringProps({ rotation: [-10, -10, -10] })}
                onPointerLeave={() => setSpringProps({ rotation: [0, 0, 0] })}
                geometry={nodes.group1022280760.geometry}
                material={materials.mat24}
                rotation={springProps.rotation as unknown as THREE.Euler}
            />
        </group>
    );
};

export default Diamond;

useGLTF.preload("/diamond.glb");
