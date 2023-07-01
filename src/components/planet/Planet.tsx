import { GroupProps, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useGLTF, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { useSphere } from "@react-three/cannon";

interface GLTFResult {
    nodes: {
        Planet_7: THREE.Mesh;
    };
    materials: {
        Atlas: THREE.MeshStandardMaterial;
    };
    scene: THREE.Scene;
}

const textureLoader = new THREE.TextureLoader();

const Planet = (props: GroupProps) => {
    const [ref, api] = useSphere(() => ({
        redius: 1,
        mass: 0,
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        linearDamping: 0.9,
        angularDamping: 0.9,
    }));
    // const ref = useRef<THREE.Group>(null);
    const gltf = useGLTF("/Planet.glb") as unknown as GLTFResult;
    const { nodes, materials } = gltf;

    useEffect(() => {
        const goldMatcap = textureLoader.load("/gold.png");
        const normalTexture = textureLoader.load("/Lava_005_NORM.jpg");
        goldMatcap.mapping = THREE.EquirectangularRefractionMapping;

        if (materials.Atlas) {
            materials.Atlas.opacity = 1;
            materials.Atlas.transparent = false;
            materials.Atlas.envMap = goldMatcap;
            materials.Atlas.normalMap = normalTexture;
            materials.Atlas.normalScale.set(0.5, 0.5);
            materials.Atlas.roughness = 0;
            materials.Atlas.metalness = 1;
        }
        if (nodes.Planet_7.geometry) {
            nodes.Planet_7.geometry.scale(3, 3, 3);
        }
    }, [gltf, materials.Atlas, nodes.Planet_7.geometry]);

    const scroll = useScroll();

    useFrame(({ mouse }) => {
        if (scroll?.offset === null || scroll?.offset === undefined || !ref.current) return;

        // gsap.to(ref.current.rotation, {
        //     x: mouse.y,
        //     z: mouse.x,
        //     duration: 10,
        //     ease: "ease",
        // });

        api.rotation.set(mouse.y, mouse.x, 0);

        // gltf.nodes.Planet_7.rotation.y += 0.001;
        // gltf.nodes.Planet_7.rotation.z += 0.001;
        // gltf.nodes.Planet_7.rotation.x += 0.001;

        materials.Atlas.normalScale.set(scroll.offset * mouse.x, scroll.offset * mouse.y);
    });

    return (
        <group ref={ref} {...props} dispose={null}>
            <primitive object={gltf.scene} />
        </group>
    );
};

export default Planet;

useGLTF.preload("/Planet.glb");
