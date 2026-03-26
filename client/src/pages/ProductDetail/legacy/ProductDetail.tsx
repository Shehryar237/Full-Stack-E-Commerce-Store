// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById} from '../../services/productService';
import type {Product} from '../../services/productService';
import MainLayout from '../../components/layout/MainLayout/MainLayout';
import { Button } from 'primereact/button';
import styles from './ProductDetail.module.css';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (id) fetchProductById(id).then(p => setProduct(p));
    }, [id]);

    if (!product) return <div>Loading…</div>;
    return (
        <MainLayout>
            <div style={{ padding: '2rem' }}>
                <h1>{product.title}</h1>
                    <img
                    alt="Product"
                    src={'/images/placeholder.jpg'}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '440px',
                            objectFit: 'contain',
                            display: 'block',
                            marginBottom: '1rem'
                        }}
                    />
                <p>{product.description}</p>

                <p>ID: {product.id}</p>
                <div className={styles.detailsFooter}>
                    <Button
                    label="Add to cart"
                    icon="pi pi-shopping-cart"
                    className={styles.buyButton}/>

                    <div className={styles.detailsPriceTag}><strong>$ {product.price}</strong></div>
                </div>
            </div>
                {/* Rating/reviews here later*/}
        </MainLayout>
    );
}
