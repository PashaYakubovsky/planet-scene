import { GroupProps, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useGLTF, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated, config } from "@react-spring/three";

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
    const ref = useRef<THREE.Group>(null);
    const gltf = useGLTF("/Planet.glb") as unknown as GLTFResult;
    const { nodes, materials } = gltf;

    useEffect(() => {
        const goldMatcap = textureLoader.load("/sharp.png");
        const normalTexture = textureLoader.load("/Lava_005_NORM.jpg");
        goldMatcap.mapping = THREE.EquirectangularRefractionMapping;

        if (materials.Atlas) {
            materials.Atlas.opacity = 1;
            materials.Atlas.transparent = false;
            materials.Atlas.envMap = goldMatcap;
            materials.Atlas.normalMap = normalTexture;
            materials.Atlas.normalScale.set(0.5, 0.5);
            materials.Atlas.roughness = 0.1;
            materials.Atlas.metalness = 1;
        }
        if (nodes.Planet_7.geometry) {
            nodes.Planet_7.geometry.scale(3, 3, 3);
        }
    }, [gltf, materials.Atlas, nodes.Planet_7.geometry]);

    const scroll = useScroll();

    useFrame(({ mouse }) => {
        if (scroll?.offset === null || scroll?.offset === undefined || !ref.current) return;

        setSpringProps({ rotation: [mouse.x, mouse.y, 0], config: { ...config.molasses } });

        materials.Atlas.normalScale.set(2 * mouse.x, 2 * mouse.y);
    });

    // Animate the position when hovering over the box
    const [springProps, setSpringProps] = useSpring(() => ({
        rotation: [0, 0, 0],
        ease: { ...config.molasses },
    }));

    return (
        <animated.group
            rotation={springProps.rotation as unknown as THREE.Euler}
            ref={ref as React.RefObject<THREE.Group>}
            {...props}
            dispose={null}
        >
            <primitive object={gltf.scene} />
        </animated.group>
    );
};

export default Planet;

useGLTF.preload("/Planet.glb");
