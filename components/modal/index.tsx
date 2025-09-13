import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './style.module.css';

// Tambahkan interface untuk props
interface ModalProps {
    modal: {
        active: boolean;
        index: number;
    };
    certificates: Array<{
        src: string;
        color: string;
        // Tambahkan properti lain jika ada, misal title: string;
    }>;
}

const scaleAnimation = {
    initial: { scale: 0, x: "-50%", y: "-50%" },
    enter: { scale: 1, x: "-50%", y: "-50%" },
    closed: { scale: 0, x: "-50%", y: "-50%" }
};

export default function index({ modal, certificates }: ModalProps) {
    const { active, index } = modal;
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Tambahkan ref untuk GSAP
    const modalContainer = useRef(null);
    const cursorLabel = useRef(null);

    // Deteksi tema
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Move Container
        let xMoveContainer = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" });
        let yMoveContainer = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" });
        // Move cursor label (gabung cursor dan label menjadi satu)
        let xMoveCursorLabel = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" });
        let yMoveCursorLabel = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" });

        window.addEventListener('mousemove', (e) => {
            const { pageX, pageY } = e;
            xMoveContainer(pageX);
            yMoveContainer(pageY);
            xMoveCursorLabel(pageX);
            yMoveCursorLabel(pageY);
        });

        // Cleanup event listener
        return () => {
            window.removeEventListener('mousemove', () => { });
        };
    }, []);

    return (
        <>
            <motion.div
                ref={modalContainer}
                variants={scaleAnimation}
                initial="initial"
                animate={active ? "enter" : "closed"}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={styles.modalContainer}
            >
                <div style={{ top: index * -100 + "%" }} className={styles.modalSlider}>
                    {certificates.map((project, idx) => {
                        const { src } = project;  // Hapus color karena tidak digunakan
                        return (
                            <div
                                className={styles.modal}
                                key={`modal_${idx}`}
                            >
                                <Image
                                    src={`/images/${src}`}
                                    alt={project.src || `certificate_${idx}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                            </div>
                        );
                    })}
                </div>
            </motion.div>
            <motion.div
                ref={cursorLabel}
                className={styles.cursorLabel}
                variants={scaleAnimation}
                initial="initial"
                animate={active ? "enter" : "closed"}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                data-theme={isDarkMode ? 'dark' : 'light'}
            >
                View
            </motion.div>
        </>
    );
}
