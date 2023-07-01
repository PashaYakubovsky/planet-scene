import { Canvas } from "@react-three/fiber";
import Scene from "./scene";
import styles from "./App.module.scss";
import { useRef } from "react";
import MainLoader from "./components/loaders/MainLoader";
import { Physics } from "@react-three/cannon";

const App = () => {
    const mainRef = useRef<HTMLCanvasElement>(null);

    return (
        <MainLoader>
            <main className={styles.planetScene}>
                <Canvas
                    ref={mainRef}
                    gl={{
                        powerPreference: "high-performance",
                        antialias: false,
                        stencil: false,
                        pixelRatio: Math.min(window.devicePixelRatio, 2),
                    }}
                >
                    <Physics>
                        <Scene />
                    </Physics>
                </Canvas>

                <footer className={styles.footer}>
                    <a href="https://github.com/PashaYakubovsky" target="_blank" rel="noreferrer">
                        Pasha Yakubovsky
                    </a>
                </footer>
            </main>
        </MainLoader>
    );
};

export default App;
