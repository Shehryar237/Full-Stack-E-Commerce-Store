// src/pages/AdminDashboard/AdminDashBoard.tsx
import React, { useState } from 'react';
import NavBar from '../../components/layout/NavBar/Navbar';
import { Collapse } from '@mantine/core';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import styles from './AdminDashBoard.module.css';
import * as productService from '../../services/productService';
import ProductModal from '../../components/productModal/productModal';
import type { ProductData } from '../../components/productModal/productModal';

export default function AdminDashboard() {

    // placeholder stats — wire up to real api calls later
    const stats = [
        { label: 'total products', value: 128, icon: 'pi pi-box',        color: 'blue'   },
        { label: 'total orders',   value: 342, icon: 'pi pi-receipt',     color: 'green'  },
        { label: 'total users',    value: 76,  icon: 'pi pi-users',       color: 'purple' },
    ];

    const [addOpened, setAddOpened]     = useState(false);
    const [trafficOpen, setTrafficOpen] = useState(false);
    const [revenueOpen, setRevenueOpen] = useState(false);

    const handleAdd = async (
        _id: string | undefined,
        data: ProductData,
        imageFile?: File | null
    ) => {
        await productService.postAddProduct(
            data.title,
            data.description,
            data.price,
            data.stock,
            imageFile
        );
    };

    // placeholder chart data — replace with real data later
    const trafficData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
            label: 'visitors',
            data: [120, 200, 150, 300, 250],
            fill: true,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
        }],
    };

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
            label: 'revenue ($)',
            data: [5000, 7000, 4000, 9000],
            backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'],
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    const chartOptions = {
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: '#f3f4f6' } },
        },
    };

    return (
        <>
            <NavBar />

            <div className={styles.page}>

                {/* ── header ── */}
                <div className={styles.headerRow}>
                    <div>
                        <h1 className={styles.pageTitle}>admin dashboard</h1>
                        <p className={styles.pageMeta}>overview of your store</p>
                    </div>
                </div>

                {/* ── stat cards ── */}
                <div className={styles.statsGrid}>
                    {stats.map(stat => (
                        <div key={stat.label} className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles[stat.color]}`}>
                                <i className={stat.icon} />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── traffic chart ── */}
                <div className={styles.section}>
                    <div
                        className={styles.sectionHeader}
                        onClick={() => setTrafficOpen(o => !o)}
                    >
                        <div className={styles.sectionHeaderLeft}>
                            <div className={`${styles.sectionIcon} ${styles.blue}`}>
                                <i className="pi pi-chart-line" />
                            </div>
                            <p className={styles.sectionTitle}>traffic overview</p>
                        </div>
                        <i className={`pi pi-chevron-down ${styles.chevron} ${trafficOpen ? styles.open : ''}`} />
                    </div>
                    <Collapse in={trafficOpen}>
                        <div className={styles.sectionBody}>
                            <Chart type="line" data={trafficData} options={chartOptions} />
                        </div>
                    </Collapse>
                </div>

                {/* ── revenue chart ── */}
                <div className={styles.section}>
                    <div
                        className={styles.sectionHeader}
                        onClick={() => setRevenueOpen(o => !o)}
                    >
                        <div className={styles.sectionHeaderLeft}>
                            <div className={`${styles.sectionIcon} ${styles.green}`}>
                                <i className="pi pi-chart-bar" />
                            </div>
                            <p className={styles.sectionTitle}>revenue overview</p>
                        </div>
                        <i className={`pi pi-chevron-down ${styles.chevron} ${revenueOpen ? styles.open : ''}`} />
                    </div>
                    <Collapse in={revenueOpen}>
                        <div className={styles.sectionBody}>
                            <Chart type="bar" data={revenueData} options={chartOptions} />
                        </div>
                    </Collapse>
                </div>

                {/* ── manage products ── */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader} style={{ cursor: 'default' }}>
                        <div className={styles.sectionHeaderLeft}>
                            <div className={`${styles.sectionIcon} ${styles.purple}`}>
                                <i className="pi pi-box" />
                            </div>
                            <p className={styles.sectionTitle}>manage products</p>
                        </div>
                        <Button
                            label="add product"
                            icon="pi pi-plus"
                            className={styles.addBtn}
                            onClick={() => setAddOpened(true)}
                        />
                    </div>
                </div>

            </div>

            {/* ── add product modal ── */}
            <ProductModal
                opened={addOpened}
                title="add product"
                onClose={() => setAddOpened(false)}
                onSubmit={handleAdd}
                initialData={{ title: '', description: '', price: 0, stock: 0 }}
            />
        </>
    );
}
