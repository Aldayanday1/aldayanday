import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './style.module.css';

// Interface untuk props
interface ModalProps {
    modal: {
        active: boolean;
        index: number;
    };
    certificates: Array<{
        src: string;
        color: string;
    }>;
}

const scaleAnimation = {
    initial: { scale: 0, x: "-50%", y: "-50%" },
    enter: { scale: 1, x: "-50%", y: "-50%" },
    closed: { scale: 0, x: "-50%", y: "-50%" }
};

export default function Modal({ modal, certificates }: ModalProps) {
    const { active, index } = modal;

    // Refs untuk GSAP
    const modalContainer = useRef<HTMLDivElement>(null);
    const cursor = useRef<HTMLDivElement>(null);
    const cursorLabel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!modalContainer.current || !cursor.current || !cursorLabel.current) return;

        // GSAP quickTo functions
        const xMoveContainer = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" });
        const yMoveContainer = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" });

        const xMoveCursor = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" });
        const yMoveCursor = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" });
        const xMoveCursorLabel = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" });
        const yMoveCursorLabel = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" });

        const handleMovement = (pageX: number, pageY: number) => {
            const isMobile = window.innerWidth <= 640;

            // Ukuran modal berdasarkan device
            const modalWidth = isMobile ? 300 : 400;
            const modalHeight = isMobile ? 250 : 350;

            let modalScale = 1;
            let finalX = pageX;
            let finalY = pageY;

            if (isMobile) {
                // Hitung jarak dari ujung layar
                const edgeThreshold = 80;
                const distanceFromLeft = pageX;
                const distanceFromRight = window.innerWidth - pageX;
                const distanceFromTop = pageY;
                const distanceFromBottom = window.innerHeight - pageY;

                // Dynamic scaling berdasarkan posisi
                if (distanceFromLeft < edgeThreshold || distanceFromRight < edgeThreshold) {
                    const minDistance = Math.min(distanceFromLeft, distanceFromRight);
                    modalScale = Math.max(0.5, minDistance / edgeThreshold); // Scale 50%-100%
                }

                if (distanceFromTop < edgeThreshold || distanceFromBottom < edgeThreshold) {
                    const minDistance = Math.min(distanceFromTop, distanceFromBottom);
                    const verticalScale = Math.max(0.6, minDistance / edgeThreshold);
                    modalScale = Math.min(modalScale, verticalScale);
                }

                // Clamp position dengan considerasi scale
                const halfWidth = (modalWidth * modalScale) / 2;
                const halfHeight = (modalHeight * modalScale) / 2;
                const margin = 15; // Safety margin

                finalX = Math.max(halfWidth + margin, Math.min(pageX, window.innerWidth - halfWidth - margin));
                finalY = Math.max(halfHeight + margin, Math.min(pageY, window.innerHeight - halfHeight - margin));
            }

            // Apply transformations dengan null check
            if (modalContainer.current) {
                xMoveContainer(finalX);
                yMoveContainer(finalY);
                gsap.set(modalContainer.current, { scale: modalScale });
            }

            if (cursor.current && cursorLabel.current) {
                xMoveCursor(finalX);
                yMoveCursor(finalY);
                xMoveCursorLabel(finalX);
                yMoveCursorLabel(finalY);
            }
        };

        // Mouse handler
        const mouseHandler = (e: MouseEvent) => {
            handleMovement(e.pageX, e.pageY);
        };

        // Touch handler untuk mobile
        const touchHandler = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleMovement(touch.pageX, touch.pageY);
            }
        };

        // Event listeners
        window.addEventListener('mousemove', mouseHandler);
        window.addEventListener('touchmove', touchHandler, { passive: false });
        window.addEventListener('touchstart', touchHandler, { passive: false });

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', mouseHandler);
            window.removeEventListener('touchmove', touchHandler);
            window.removeEventListener('touchstart', touchHandler);
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
                    {certificates.map((certificate, idx) => {
                        const { src } = certificate;
                        return (
                            <div
                                className={styles.modal}
                                key={`modal_${idx}`}
                            >
                                <Image
                                    src={`/images/${src}`}
                                    alt={`Certificate ${idx + 1}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    priority={idx === 0}
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
            />
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
