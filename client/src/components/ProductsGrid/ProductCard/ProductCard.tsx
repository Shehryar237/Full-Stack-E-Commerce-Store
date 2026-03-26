import React from 'react';
import { Button } from 'primereact/button';
import styles from './ProductCard.module.css';
import { Link } from 'react-router-dom';
import * as cartService from '../../../services/cartService';

const API_BASE = "http://localhost:5000";

type Product = {
    id: string;
    title: string;
    price: number;
    stock: number;
    description: string;
    imageUrl?: string;
    qty?: number;
};

type Props = {
    title: string;
    id: string;
    price: number;
    stock: number;
    description: string;
    imageUrl?: string;
    isAdmin?: boolean;
    qty?: number;
    onDelete?: (id: string) => void;
    onEdit?: (product: Product) => void;
};

export default function ProductCard({ id, title, price, stock, description, imageUrl, isAdmin, onDelete, onEdit }: Props) {
    const isOutOfStock = stock <= 0;
    const isLowStock   = stock > 0 && stock <= 5;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        cartService.addProductToCart(id, title, price);
    };

    return (
        <div className={styles.card}>

            {/* Image */}
            <div className={styles.imageWrapper}>
                <img
                    alt={title}
                    src={imageUrl ? `${API_BASE}${imageUrl}` : '/images/placeholder.jpg'}
                    className={styles.productImage}
                />
                {isOutOfStock && (
                    <div className={styles.outOfStockOverlay}>
                        <span className={styles.outOfStockBadge}>Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className={styles.body}>
                <p className={styles.title}>{title}</p>
                <p className={styles.price}>${Number(price).toFixed(2)}</p>
                {isLowStock && (
                    <p className={`${styles.stockLabel} ${styles.low}`}>
                        Only {stock} left
                    </p>
                )}
                {!isOutOfStock && !isLowStock && (
                    <p className={styles.stockLabel}>In stock</p>
                )}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                {!isAdmin && (
                    <Button
                        label={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        icon="pi pi-shopping-cart"
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                        className={styles.cartBtn}
                    />
                )}

                <Link to={`/products/${id}`}>
                    <Button
                        label="View"
                        className={styles.viewBtn}
                    />
                </Link>

                {isAdmin && (
                    <>
                        <Button
                            icon="pi pi-pencil"
                            className={`p-button-text ${styles.iconBtn}`}
                            onClick={() => onEdit?.({ id, title, price, stock, description })}
                            tooltip="Edit"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            icon="pi pi-trash"
                            className={`p-button-danger ${styles.iconBtn}`}
                            onClick={() => onDelete?.(id)}
                            tooltip="Delete"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
