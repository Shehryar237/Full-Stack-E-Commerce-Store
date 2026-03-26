// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../../services/productService';
import type { Product } from '../../services/productService';
import MainLayout from '../../components/layout/MainLayout/MainLayout';
import { Button } from 'primereact/button';
import * as cartService from '../../services/cartService';
import styles from './ProductDetail.module.css';

const API_BASE = 'http://localhost:5000';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct]     = useState<Product | null>(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState<string | null>(null);
    const [imgError, setImgError]   = useState(false);
    // track add to cart feedback
    const [added, setAdded]         = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchProductById(id)
            .then(p => setProduct(p))
            .catch(() => setError('Failed to load product'))
            .finally(() => setLoading(false));
    }, [id]);

    // brief "Added!" feedback then reset
    const handleAddToCart = () => {
        if (!product || product.stock <= 0) return;
        cartService.addProductToCart(product.id, product.title, product.price);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    // stock badge helper
    const stockBadge = () => {
        if (!product) return null;
        if (product.stock <= 0)
            return <span className={`${styles.stockBadge} ${styles.outOfStock}`}>out of stock</span>;
        if (product.stock <= 5)
            return <span className={`${styles.stockBadge} ${styles.lowStock}`}>only {product.stock} left</span>;
        return <span className={`${styles.stockBadge} ${styles.inStock}`}>in stock</span>;
    };

    if (loading) {
        return (
            <MainLayout>
                <div className={styles.stateMessage}>
                    <i className="pi pi-spinner pi-spin" />
                    loading product…
                </div>
            </MainLayout>
        );
    }

    if (error || !product) {
        return (
            <MainLayout>
                <div className={styles.stateMessage}>
                    <i className="pi pi-exclamation-triangle" style={{ color: '#ef4444' }} />
                    {error ?? 'product not found'}
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className={styles.page}>

                {/* breadcrumb */}
                <div className={styles.breadcrumb}>
                    <Link to="/products">products</Link>
                    <i className="pi pi-angle-right" style={{ fontSize: '0.7rem' }} />
                    <span>{product.title}</span>
                </div>

                <div className={styles.layout}>

                    {/*left col*/}
                    <div className={styles.imageCol}>
                        <div className={styles.imageWrapper}>
                            {imgError || !product.imageUrl ? (
                                <div className={styles.imagePlaceholder}>
                                    <i className="pi pi-image" />
                                </div>
                            ) : (
                                <img
                                    alt={product.title}
                                    src={`${API_BASE}${product.imageUrl}`}
                                    className={styles.productImage}
                                    onError={() => setImgError(true)}
                                />
                            )}
                        </div>
                    </div>

                    {/*ight col*/}
                    <div className={styles.infoCol}>

                        <h1 className={styles.title}>{product.title}</h1>

                        {/* price +stock badge */}
                        <div className={styles.priceRow}>
                            <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
                            {stockBadge()}
                        </div>

                        <hr className={styles.divider} />

                        <div>
                            <p className={styles.descriptionLabel}>description</p>
                            <p className={styles.description}>
                                {product.description || 'no description available.'}
                            </p>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.actions}>
                            <Button
                                label={added ? 'added!' : 'add to cart'}
                                icon={added ? 'pi pi-check' : 'pi pi-shopping-cart'}
                                disabled={product.stock <= 0}
                                onClick={handleAddToCart}
                                className={styles.cartBtn}
                            />
                            {/* wishlist placeholder for later*/}
                            <Button
                                icon="pi pi-heart"
                                className={styles.wishlistBtn}
                                tooltip="save for later"
                                tooltipOptions={{ position: 'top' }}
                            />
                        </div>

                        {/* meta */}
                        <p className={styles.meta}>product id: {product.id}</p>

                        {/* rating/reviews here later */}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
