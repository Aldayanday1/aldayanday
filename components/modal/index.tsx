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

    // Tambahkan ref untuk GSAP
    const modalContainer = useRef<HTMLDivElement | null>(null);
    const cursor = useRef<HTMLDivElement | null>(null);
    const cursorLabel = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const isMobile = window.innerWidth <= 640;

        // Move Container
        const xMoveContainer = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" });
        const yMoveContainer = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" });
        const scaleContainer = gsap.quickTo(modalContainer.current, "scale", { duration: 0.8, ease: "power3" });
        // Move cursor
        const xMoveCursor = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" });
        const yMoveCursor = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" });
        // Move cursor label
        const xMoveCursorLabel = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" });
        const yMoveCursorLabel = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" });

        const handleInteraction = (clientX: number, clientY: number) => {
            const modalWidth = isMobile ? 300 : 400;
            const modalHeight = isMobile ? 250 : 350;

            // Clamp posisi agar tidak melebihi viewport
            const clampedX = Math.max(modalWidth / 2, Math.min(clientX, window.innerWidth - modalWidth / 2));
            const clampedY = Math.max(modalHeight / 2, Math.min(clientY, window.innerHeight - modalHeight / 2));

            // Hitung scale berdasarkan jarak ke edge untuk responsive sizing
            const distanceToRight = window.innerWidth - clientX;
            const distanceToBottom = window.innerHeight - clientY;
            const distanceToLeft = clientX;
            const distanceToTop = clientY;

            const minDistance = Math.min(distanceToRight, distanceToBottom, distanceToLeft, distanceToTop);

            // Scale calculation berbeda untuk mobile vs desktop
            let scale: number;
            if (isMobile) {
                // Di mobile, scale lebih agresif untuk UX yang lebih baik
                scale = Math.max(0.3, Math.min(1, minDistance / 100));
            } else {
                // Di desktop, scale lebih subtle
                scale = Math.max(0.6, Math.min(1, minDistance / 200));
            }

            xMoveContainer(clampedX);
            yMoveContainer(clampedY);
            scaleContainer(scale);
            xMoveCursor(clampedX);
            yMoveCursor(clampedY);
            xMoveCursorLabel(clampedX);
            yMoveCursorLabel(clampedY);
        };

        // Handler untuk desktop (mousemove)
        const mouseHandler = (e: MouseEvent) => {
            handleInteraction(e.clientX, e.clientY);
        };

        // Handler untuk mobile (touchmove)
        const touchHandler = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleInteraction(touch.clientX, touch.clientY);
            }
        };

        // Event listeners
        if (isMobile) {
            window.addEventListener('touchmove', touchHandler, { passive: false });
            window.addEventListener('touchstart', touchHandler, { passive: false });
        } else {
            window.addEventListener('mousemove', mouseHandler);
        }

        return () => {
            if (isMobile) {
                window.removeEventListener('touchmove', touchHandler);
                window.removeEventListener('touchstart', touchHandler);
            } else {
                window.removeEventListener('mousemove', mouseHandler);
            }
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
                        const { src } = project;
                        return (
                            <div
                                className={styles.modal}
                                key={`modal_${idx}`}
                            >
                                <Image
                                    src={`/images/${src}`}
                                    alt={project.src || `certificate_${idx}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    sizes="(max-width: 768px) 100vw, 800px"
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
