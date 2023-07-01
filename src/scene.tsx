import * as THREE from "three";
// import styles from "./scene.module.scss";
import Planet from "./components/planet/Planet";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useScroll } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import Ground from "./components/Ground/Ground";
import Diamond from "./components/Diamond/Diamond";
import { Perf } from "r3f-perf";
import { gsap } from "gsap";

const textureLoader = new THREE.TextureLoader();

const Scene = () => {
    const [isDebug, changeIsDebug] = useState(false);
    const [matcapTexture, changeMatcapTexture] = useState<THREE.Texture | null>(null);
    const query = useMemo(() => new URLSearchParams(window.location.search), []);
    const ambientLightRef = useRef<THREE.AmbientLight>(null);
    const pointLightRef = useRef<THREE.PointLight>(null);
    const scroll = useScroll();
    const cameraRef = useRef({ move: false });

    useEffect(() => {
        changeMatcapTexture(textureLoader.load("/10.png"));

        if (query.get("debug") === "true") {
            changeIsDebug(true);
        }
    }, [query]);

    const camera = useThree(({ camera }) => {
        camera.position.set(0, 0, 100);
        camera.rotation.set(0, 0, 1);
        return camera;
    });

    useFrame(() => {
        if (isDebug) return;
        if (
            scroll?.offset === null ||
            scroll?.offset === undefined ||
            !ambientLightRef.current ||
            !pointLightRef.current
        )
            return;

        // lights animation on scroll
        // ambientLightRef.current.intensity = THREE.MathUtils.lerp(scroll.offset, 2, 0.01);
        // pointLightRef.current.intensity = THREE.MathUtils.lerp(scroll.offset * 40, 10, 0.1);
        pointLightRef.current.position.z = THREE.MathUtils.lerp(scroll.offset * 5, -20, 0.1);

        // camera animation on scroll
        // camera.position.z = THREE.MathUtils.lerp(scroll.offset * 4 + 10, 10, 0.1);
    });

    return (
        <>
            {/* plane object use like wall */}
            <mesh position={[0, 0, -100]} rotation={[0, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshBasicMaterial envMap={matcapTexture} />
            </mesh>

            {/* Debug */}
            {isDebug && <Perf />}
            {isDebug && <OrbitControls position={[0, 0, 20]} />}

            <Stars count={500} depth={10} radius={10} factor={1} saturation={1} fade={true} />

            <pointLight
                ref={pointLightRef}
                position={[0, 10, 20]}
                intensity={10}
                color={new THREE.Color("rgb(70, 223, 240)")}
            />
            <ambientLight
                ref={ambientLightRef}
                color={new THREE.Color("rgb(70, 223, 240)")}
                intensity={1}
            />
            <directionalLight
                position={[0, 0, 10]}
                intensity={1}
                color={new THREE.Color("rgb(70, 223, 240)")}
            />

            <Ground />

            <Planet
                onPointerMove={e => {
                    e.stopPropagation();
                    // cursor with hand
                    document.body.style.cursor = "pointer";
                }}
                onPointerLeave={e => {
                    e.stopPropagation();
                    document.body.style.cursor = "";
                }}
                onClick={async () => {
                    if (cameraRef.current.move) return;
                    cameraRef.current.move = true;

                    gsap.to(camera.position, {
                        duration: 2.5,
                        ease: "slow(0.7, 0.7, false)",
                        x: 0,
                        y: 0,
                        z: camera.position.z <= 10 ? 100 : 9,
                        onComplete() {
                            cameraRef.current.move = false;
                        },
                    });
                    gsap.to(camera.rotation, {
                        x: 0,
                        y: 0,
                        duration: 2.5,
                        ease: "sine.out",
                        z: camera.rotation.z >= 1 ? 0 : 1,
                        onComplete() {
                            cameraRef.current.move = false;
                        },
                    });
                }}
                position={[0, -1.4, 0]}
            />

            {Array(10)
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

                    return (
                        <Diamond
                            key={i}
                            rotation={randomRotation as unknown as THREE.Euler}
                            position={randomPosition as unknown as THREE.Vector3}
                        />
                    );
                })}

            <EffectComposer>
                <DepthOfField />
            </EffectComposer>
        </>
    );
};

export default Scene;
