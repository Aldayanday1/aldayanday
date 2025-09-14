/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import gsap from 'gsap';

interface MagneticGSAPProps {
    children: React.ReactElement;
    strength?: number; // Kekuatan magnet (default 0.3)
    range?: number; // Jarak maksimal efek (default 100px)
    duration?: number; // Durasi animasi (default 1)
}

const MagneticGSAP = forwardRef<HTMLDivElement, MagneticGSAPProps>(({
    children,
    strength = 0.3,
    range = 100,
    duration = 1
}, ref) => {
    const magneticRef = useRef<HTMLDivElement>(null);

    // Gabungkan ref eksternal dengan internal ref
    const combinedRef = useCallback((node: HTMLDivElement | null) => {
        magneticRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    }, [ref]);

    const mouseMove = useCallback((e: MouseEvent) => {
        if (!magneticRef.current) return;

        const { clientX, clientY } = e;
        const rect = magneticRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        // Hitung jarak dari pusat
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        // Jika dalam range, terapkan efek magnet
        if (distance < range) {
            const x = deltaX * strength;
            const y = deltaY * strength;

            gsap.to(magneticRef.current, {
                x,
                y,
                duration,
                ease: "elastic.out(1, 0.3)"
            });
        }
    }, [strength, range, duration]);

    const mouseLeave = useCallback(() => {
        if (!magneticRef.current) return;

        gsap.to(magneticRef.current, {
            x: 0,
            y: 0,
            duration,
            ease: "elastic.out(1, 0.3)"
        });
    }, [duration]);

    useEffect(() => {
        const element = magneticRef.current;
        if (!element) return;

        element.addEventListener('mousemove', mouseMove);
        element.addEventListener('mouseleave', mouseLeave);

        return () => {
            element.removeEventListener('mousemove', mouseMove);
            element.removeEventListener('mouseleave', mouseLeave);
        };
    }, [mouseMove, mouseLeave]);

    // Bungkus children dengan div yang memiliki ref
    return (
        <div ref={combinedRef} style={{ display: 'inline-block' }}>
            {children}
        </div>
    );
});

MagneticGSAP.displayName = 'MagneticGSAP';

export default MagneticGSAP;