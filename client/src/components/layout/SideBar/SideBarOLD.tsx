// SideBar.tsx
import React from 'react';
import styles from './SideBar.module.css';
import { BreadCrumb } from 'primereact/breadcrumb';
export default function SideBar() {
    return (
        <aside className={styles.sidebar}>
        <BreadCrumb/>
        <nav>
            <ul className={styles.menu}>
            <li>Home</li>
            <li>Products</li>
            <li>Settings</li>
            </ul>
        </nav>
        </aside>
    );
}
