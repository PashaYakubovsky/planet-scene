import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useGLTF, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

// import glsl from "babel-plugin-glsl/macro";

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
    const mouse = useThree(state => state.mouse);

    useEffect(() => {
        const colorTexture = textureLoader.load("/Lava_005_COLOR.jpg");
        const normalTexture = textureLoader.load("/Lava_005_NORM.jpg");
        colorTexture.mapping = THREE.EquirectangularReflectionMapping;

        if (materials.Atlas) {
            materials.Atlas.opacity = 1;
            materials.Atlas.transparent = false;

            materials.Atlas.envMap = colorTexture;

            materials.Atlas.normalMap = normalTexture;

            materials.Atlas.normalScale.set(0.5, 0.5);
            materials.Atlas.roughness = 0;
            materials.Atlas.metalness = 1;
        }
        if (nodes.Planet_7.geometry) {
            nodes.Planet_7.geometry.scale(2, 2, 2);
        }
    }, [gltf, materials.Atlas, nodes.Planet_7.geometry]);

    const scroll = useScroll();

    useFrame(({ camera }) => {
        if (scroll?.offset === null || scroll?.offset === undefined || !ref.current) return;

        // animation on scroll
        camera.position.z = THREE.MathUtils.lerp(scroll.offset * 15, 0, 0.1);

        gsap.to(ref.current.rotation, {
            x: mouse.y,
            z: mouse.x,
            duration: 10,
            ease: "ease",
        });

        gltf.nodes.Planet_7.rotation.y += 0.001;
        gltf.nodes.Planet_7.rotation.z += 0.001;
        gltf.nodes.Planet_7.rotation.x += 0.001;
    });

    return (
        <group ref={ref} {...props} dispose={null}>
            <primitive object={gltf.scene} />
        </group>
    );
};

export default Planet;

useGLTF.preload("/Planet.glb");