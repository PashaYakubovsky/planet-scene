import styles from "./MainLoader.module.scss";
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Dna } from "react-loader-spinner";

const MainLoader = ({ children }: { children?: React.ReactNode }) => {
    const [isVisible, changeIsVisible] = useState<boolean>(true);

    const { progress } = useProgress();

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                changeIsVisible(false);
            }, 1000);
        }
    }, [progress]);

    return (
        <>
            {!isVisible ? (
                children
            ) : (
                <Dna
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass={styles.spinner}
                />
            )}
        </>
    );
};

export default MainLoader;
