'use client';
import React from 'react'
import styles from './style.module.css';

export default function index({ index, title, setModal }: { index: number; title: string; setModal: (modal: { active: boolean; index: number }) => void }) {

    return (
        <div onMouseEnter={() => { setModal({ active: true, index }) }} onMouseLeave={() => { setModal({ active: false, index }) }} className={styles.project}>
            <h2>{title}</h2>
            <p>Design & Development</p>
        </div>
    )
}