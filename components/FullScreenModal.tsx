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
        <div className="fixed inset-0 z-50">
            {/* Overlay + blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 h-full w-full backdrop-blur-sm"
                onClick={(e) => {
                    // clicking the overlay (outside the modal content) closes the modal
                    if (e.target === e.currentTarget) onClose();
                }}
            />

            {/* Modal container */}
            <div className="fixed inset-0 grid place-items-center z-[999999] pointer-events-none">
                <motion.div
                    ref={overlayRef}
                    className="relative max-w-4xl max-h-[90vh] w-full mx-4 pointer-events-auto"
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
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors bg-black text-white hover:bg-gray-100 hover:text-black cursor-pointer"
                        aria-label="Close modal"
                        style={{ zIndex: 3 }}
                    >
                        ×
                    </button>
                </motion.div>
            </div>
        </div>
    );
}