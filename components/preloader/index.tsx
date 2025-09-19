'use client';

import styles from './style.module.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { opacity, slideUp } from './anim';

const words = ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten tag", "Hallo"];

export default function Index() {
    const [index, setIndex] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
        if (index === words.length - 1) return;
        setTimeout(() => {
            setIndex(index + 1);
        }, index === 0 ? 1000 : 150);
    }, [index]);

    // Make curve more pronounced on mobile - use responsive curve depth
    const curveDepth = dimension.width <= 768 ? 400 : 300; // Deeper curve for mobile
    const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + curveDepth} 0 ${dimension.height} L0 0`;
    const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

    const curve: any = {
        initial: {
            d: initialPath,
            transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] }
        },
        exit: {
            d: targetPath,
            transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1], delay: 0.3 }
        }
    };

    return (
        <motion.div variants={slideUp as any} initial="initial" exit="exit" className={styles.introduction}>
            {dimension.width > 0 && (
                <>
                    <motion.p variants={opacity} initial="initial" animate="enter">
                        <span></span>{words[index]}
                    </motion.p>
                    <svg>
                        <motion.path variants={curve} initial="initial" exit="exit"></motion.path>
                    </svg>
                </>
            )}
        </motion.div>
    );
}
