import * as THREE from "three";
// import styles from "./scene.module.scss";
import Planet from "./components/planet/Planet";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshReflectorMaterial, Sky, useScroll } from "@react-three/drei";
import { useRef } from "react";
import { EffectComposer, HueSaturation, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import Ground from "./components/Ground/Ground";
import Diamond from "./components/Diamond/Diamond";

const Scene = () => {
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
            <Sky
                distance={500}
                sunPosition={[100, -10, 28]}
                inclination={0}
                turbidity={0.1}
                azimuth={0.25}
            />

            <pointLight
                ref={pointLightRef}
                position={[0, 10, 20]}
                intensity={10}
                color={new THREE.Color("rgb(70, 223, 240)")}
            />

            <ambientLight
                ref={ambientLightRef}
                color={new THREE.Color("rgb(70, 223, 240)")}
                intensity={2}
            />

            <directionalLight
                position={[0, 0, 10]}
                intensity={1}
                color={new THREE.Color("rgb(70, 223, 240)")}
            />

            <Planet />

            <Ground />

            {Array(50)
                .fill(true)
                .map((_, i) => {
                    const randomPosition = [
                        THREE.MathUtils.randFloatSpread(10),
                        THREE.MathUtils.randFloatSpread(10),
                        THREE.MathUtils.randFloatSpread(10),
                    ];

                    return (
                        <Float
                            key={i}
                            floatingRange={[i, i]}
                            position={randomPosition as unknown as THREE.Vector3}
                            speed={0.1}>
                            <mesh>
                                <sphereGeometry args={[0.1, 32, 32]} />
                                <MeshReflectorMaterial
                                    color="rgb(70, 223, 240)"
                                    metalness={0.9}
                                    roughness={0.1}
                                    envMapIntensity={0.5}
                                    mirror={1}
                                />
                            </mesh>

                            <Diamond />
                        </Float>
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
