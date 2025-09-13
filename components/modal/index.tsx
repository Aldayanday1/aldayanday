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

export default function Modal({ modal, certificate }: ModalProps) {  // Ubah nama fungsi ke Modal (huruf besar)
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

        const handler = (e: MouseEvent) => {
            const pageX = (e as MouseEvent).pageX;
            const pageY = (e as MouseEvent).pageY;
            xMoveContainer(pageX);
            yMoveContainer(pageY);
            xMoveCursor(pageX);
            yMoveCursor(pageY);
            xMoveCursorLabel(pageX);
            yMoveCursorLabel(pageY);
        };

        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
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
                        const { src } = certificate;
                        return (
                            <div
                                className={styles.modal}
                                key={`modal_${idx}`}
                            >
                                <Image
                                    src={`/images/${src}`}
                                    alt={certificate.src || `certificates_${idx}`}
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
