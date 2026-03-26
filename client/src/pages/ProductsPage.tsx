// ProductsPage.tsx
import { useState } from 'react';
import MainLayout from "../components/layout/MainLayout/MainLayout";
import ProductsGrid from '../components/ProductsGrid/ProductsGrid';
import styles from './ProductsPage.module.css';

const CATEGORIES = ['all', 'electronics', 'desk', 'clothing', 'kitchen'];

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

    return (
        <MainLayout>
            <h1>All Products</h1>

            {/* category filter pills */}
            <div className={styles.filterRow}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`${styles.pill} ${activeCategory === (cat === 'all' ? undefined : cat) ? styles.pillActive : ''}`}
                        onClick={() => setActiveCategory(cat === 'all' ? undefined : cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <ProductsGrid category={activeCategory} />
        </MainLayout>
    );
}