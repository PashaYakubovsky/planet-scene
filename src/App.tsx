import { Canvas } from "@react-three/fiber";
import Scene from "./scene";
import styles from "./App.module.scss";
import { ScrollControls } from "@react-three/drei";
import { useRef } from "react";
import MainLoader from "./components/loaders/MainLoader";

const App = () => {
    const mainRef = useRef<HTMLCanvasElement>(null);

    return (
        <main className={styles.planetScene}>
            <MainLoader>
                <Canvas
                    ref={mainRef}
                    gl={{
                        powerPreference: "high-performance",
                        pixelRatio: Math.min(window.devicePixelRatio, 2),
                    }}>
                    <ScrollControls pages={5} damping={1}>
                        <Scene />
                    </ScrollControls>
                </Canvas>

                <footer className={styles.footer}>
                    <a href="https://github.com/PashaYakubovsky" target="_blank" rel="noreferrer">
                        Pasha Yakubovsky
                    </a>
                </footer>
            </MainLoader>
        </main>
    );
};

export default App;
