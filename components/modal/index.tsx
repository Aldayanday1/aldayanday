import { useRef, useEffect } from 'react';
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
    certificate: Array<{
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

export default function index({ modal, certificate }: ModalProps) {
    const { active, index } = modal;

    // Tambahkan ref untuk GSAP
    const modalContainer = useRef(null);
    const cursor = useRef(null);
    const cursorLabel = useRef(null);

    useEffect(() => {
        // Move Container
        let xMoveContainer = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" });
        let yMoveContainer = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" });
        // Move cursor
        let xMoveCursor = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" });
        let yMoveCursor = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" });
        // Move cursor label
        let xMoveCursorLabel = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" });
        let yMoveCursorLabel = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" });

        window.addEventListener('mousemove', (e) => {
            const { pageX, pageY } = e;
            xMoveContainer(pageX);
            yMoveContainer(pageY);
            xMoveCursor(pageX);
            yMoveCursor(pageY);
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
                    {certificate.map((certificate, idx) => {
                        const { src, color } = certificate;
                        return (
                            <div
                                className={styles.modal}
                                style={{ backgroundColor: color }}
                                key={`modal_${idx}`}
                            >
                                <Image
                                    src={`/images/${src}`}
                                    width={300}
                                    height={0}
                                    alt="image"
                                />
                            </div>
                        );
                    })}
                </div>
            </motion.div>
            <motion.div
                ref={cursor}
                className={styles.cursor}
                variants={scaleAnimation}
                initial="initial"
                animate={active ? "enter" : "closed"}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            ></motion.div>
            <motion.div
                ref={cursorLabel}
                className={styles.cursorLabel}
                variants={scaleAnimation}
                initial="initial"
                animate={active ? "enter" : "closed"}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                View
            </motion.div>
        </>
    );
}
