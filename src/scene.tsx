import * as THREE from "three";
// import styles from "./scene.module.scss";
import Planet from "./components/planet/Planet";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useRef } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import Ground from "./components/Ground/Ground";
import Diamond from "./components/Diamond/Diamond";

const textureLoader = new THREE.TextureLoader();

const Scene = () => {
    const matcapTexture = textureLoader.load("/10.png");
    const ambientLightRef = useRef<THREE.AmbientLight>(null);
    const pointLightRef = useRef<THREE.PointLight>(null);
    const scroll = useScroll();

    useThree(({ camera }) => {
        camera.position.set(0, 0, 10);
    });

    useFrame(({ camera }) => {
        if (
            scroll?.offset === null ||
            scroll?.offset === undefined ||
            !ambientLightRef.current ||
            !pointLightRef.current
        )
            return;

        // lights animation on scroll
        ambientLightRef.current.intensity = THREE.MathUtils.lerp(scroll.offset, 2, 0.01);
        pointLightRef.current.intensity = THREE.MathUtils.lerp(scroll.offset * 4, 10, 0.1);
        pointLightRef.current.position.z = THREE.MathUtils.lerp(scroll.offset * 5, -20, 0.1);

        // camera animation on scroll
        camera.position.z = THREE.MathUtils.lerp(scroll.offset + 10, 10, 0.1);
    });

    return (
        <>
            {/* plane object use like wall */}
            <mesh position={[0, 0, -100]} rotation={[0, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshBasicMaterial envMap={matcapTexture} />
            </mesh>

            <pointLight
                ref={pointLightRef}
                position={[0, 10, 20]}
                intensity={10}
                color={new THREE.Color("rgb(70, 223, 240)")}
            />

            <ambientLight
                ref={ambientLightRef}
                color={new THREE.Color("rgb(70, 223, 240)")}
                intensity={20}
            />

            <directionalLight
                position={[0, 0, 10]}
                intensity={1}
                color={new THREE.Color("rgb(70, 223, 240)")}
            />

            <Planet position={[0, -1.4, 0]} />

            <Ground />

            {Array(100)
                .fill(true)
                .map((_, i) => {
                    const randomPosition = [
                        THREE.MathUtils.randFloatSpread(10),
                        THREE.MathUtils.randFloatSpread(10),
                        THREE.MathUtils.randFloatSpread(10),
                    ];

                    const randomRotation = [
                        THREE.MathUtils.randFloatSpread(2 * Math.PI),
                        THREE.MathUtils.randFloatSpread(2 * Math.PI),
                        THREE.MathUtils.randFloatSpread(2 * Math.PI),
                    ];

                    console.log(randomPosition, randomRotation);

                    return (
                        <Diamond
                            key={i}
                            rotation={randomRotation as unknown as THREE.Euler}
                            position={randomPosition as unknown as THREE.Vector3}
                        />
                    );
                })}

            <EffectComposer>
                <Bloom
                    blendFunction={BlendFunction.SCREEN}
                    luminanceThreshold={0.9}
                    luminanceSmoothing={0.9}
                    height={300}
                    opacity={1}
                />

                <Vignette eskil={false} offset={0.01} darkness={0.1} />
            </EffectComposer>
        </>
    );
};

export default Scene;
