import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './style.module.css';

interface ModalProps {
    modal: {
        active: boolean;
        index: number;
    };
    projects: Array<{
        src: string;
        color: string;
    }>;
}

const scaleAnimation = {
    initial: { scale: 0, x: "-50%", y: "-50%" },
    enter: { scale: 1, x: "-50%", y: "-50%" },
    closed: { scale: 0, x: "-50%", y: "-50%" }
};

export default function index({ modal, projects }: ModalProps) {
    const { active, index } = modal;

    const modalContainer = useRef<HTMLDivElement | null>(null);
    const cursor = useRef<HTMLDivElement | null>(null);
    const cursorLabel = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!modalContainer.current || !cursor.current || !cursorLabel.current) return;

        const xMoveContainer = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" });
        const yMoveContainer = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" });
        const xMoveCursor = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" });
        const yMoveCursor = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" });
        const xMoveCursorLabel = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" });
        const yMoveCursorLabel = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" });

        const mouseHandler = (e: MouseEvent) => {
            const { pageX, pageY } = e;
            xMoveContainer(pageX); yMoveContainer(pageY);
            xMoveCursor(pageX); yMoveCursor(pageY);
            xMoveCursorLabel(pageX); yMoveCursorLabel(pageY);
        };

        const touchHandler = (e: TouchEvent) => {
            const t = e.touches[0] || e.changedTouches[0];
            if (!t) return;
            xMoveContainer(t.pageX); yMoveContainer(t.pageY);
            xMoveCursor(t.pageX); yMoveCursor(t.pageY);
            xMoveCursorLabel(t.pageX); yMoveCursorLabel(t.pageY);
        };

        window.addEventListener('mousemove', mouseHandler);
        window.addEventListener('touchmove', touchHandler, { passive: true });

        return () => {
            window.removeEventListener('mousemove', mouseHandler);
            window.removeEventListener('touchmove', touchHandler);
        };
    }, []);

    useEffect(() => {
        if (!modalContainer.current) return;

        if (active) {
            const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
            if (isTouch) {
                gsap.set(modalContainer.current, { left: "50%", top: "50%", xPercent: -50, yPercent: -50 });
            }
        }
    }, [active]);

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
                    {projects.map((project, idx) => {
                        const { src, color } = project;
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
