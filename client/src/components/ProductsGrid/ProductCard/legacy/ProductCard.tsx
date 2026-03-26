import React from 'react';
import { Card } from 'primereact/card';
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

type Props ={
    title:string;
    id:string;
    price:number;
    stock:number;
    description:string;
    imageUrl?: string; 
    isAdmin?:boolean;
    qty?:number;
    onDelete?:(id:string)=>void;
    onEdit?: (product: Product) => void;
}

export default function ProductCard({id, title, price, stock, description, imageUrl, isAdmin, onDelete, onEdit}:Props){
    const header = (
        <img
            alt="Product"
            src={imageUrl ? `${API_BASE}${imageUrl}` : '/images/placeholder.jpg'}
            className={styles.productImage}
        />
    );

    // click guard — extra safety in case button is enabled but stock changed server-side
    const handleAddToCart = () => {
        if (stock <= 0) {
            // defensive: do nothing if there's no stock
            return;
        }
        cartService.addProductToCart(id, title, price);
    };

    const footer = (
        <div className={styles.footer}>
            {!isAdmin && (
                <>
                    {stock > 0 ? (
                        // in-stock: normal Add to cart button
                        <Button
                            label="Add to cart"
                            icon="pi pi-shopping-cart"
                            onClick={handleAddToCart}
                        />
                    ) : (
                        // out-of-stock: visible but disabled "Out of stock" button
                        <Button
                            label="Out of stock"
                            icon="pi pi-ban"
                            disabled
                            className="p-button-outlined"
                            // If you prefer the button to be invisible instead, replace the above with:
                            // null  // <-- will hide the button entirely
                        />
                    )}
                </>
            )}

            <Link to={`/products/${id}`}>
                <Button label={"View"} />
            </Link>

            {isAdmin && (
                <>
                    <Button
                        icon="pi pi-pencil"
                        className="p-button-text"
                        onClick={() => onEdit?.({ id, title, price, stock, description })}
                    />
                    <Button
                        icon="pi pi-trash"
                        className="p-button-danger"
                        // receives onDelete from prodcutGrid
                        onClick={() => onDelete && onDelete(id)} // if we have onDelete (we are admin) 
                    />
                </>
            )}
        </div>
    );

    return (
        <Card
            title={title}
            subTitle={`$ ${Number(price).toFixed(2)}`}
            header={header}
            footer={footer}
            className={styles.card}
        >
        </Card>
    );
}
