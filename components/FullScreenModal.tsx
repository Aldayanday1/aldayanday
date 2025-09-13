import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './modal/style.module.css';

interface FullScreenModalProps {
    modal: {
        active: boolean;
        index: number;
    };
    certificates: Array<{
        src: string;
        title: string;
    }>;
    onClose: () => void;
}

const scaleAnimation = {
    initial: { scale: 0, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    closed: { scale: 0, opacity: 0 }
};

export default function FullScreenModal({ modal, certificates, onClose }: FullScreenModalProps) {
    const { active, index } = modal;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

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

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (active) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [active, onClose]);

    if (!active) return null;

    const currentCertificate = certificates[index];

    return (
        <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                // Transparent + blur glass effect (light/dark aware)
                background: isDarkMode ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)'
            }}
            variants={scaleAnimation}
            initial="initial"
            animate="enter"
            exit="closed"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => {
                if (e.target === overlayRef.current) {
                    onClose();
                }
            }}
        >
            <motion.div
                className="relative max-w-4xl max-h-[90vh] w-full mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Image
                    src={`/images/${currentCertificate.src}`}
                    alt={currentCertificate.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain rounded-lg shadow-2xl"
                    style={{ maxHeight: '90vh' }}
                />

                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors bg-black text-white hover:bg-gray-200'}`}
                    aria-label="Close modal"
                >
                    ×
                </button>
            </motion.div>
        </motion.div>
    );
}