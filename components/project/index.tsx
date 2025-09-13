'use client';
import React from 'react'
import styles from './style.module.css';

export default function index({ 
    index, 
    title, 
    setModal, 
    setFullScreenModal 
}: { 
    index: number; 
    title: string; 
    setModal: (modal: { active: boolean; index: number }) => void;
    setFullScreenModal: (modal: { active: boolean; index: number }) => void;
}) {
    const handleClick = () => {
        setFullScreenModal({ active: true, index });
    };

    return (
        <div 
            onMouseEnter={() => { setModal({ active: true, index }) }} 
            onMouseLeave={() => { setModal({ active: false, index }) }}
            onClick={handleClick}
            className={styles.project}
        >
            <h2>{title}</h2>
            <p>Certificate</p>
        </div>
    )
}