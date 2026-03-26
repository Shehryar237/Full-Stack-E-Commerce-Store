import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import * as cartService from '../../services/cartService';
import styles from './CartPage.module.css';
import type { CartItem } from '../../services/cartService';
import NavBar from '../../components/layout/NavBar/Navbar';

export default function CartPage() {
    const [cartContent, setCartContent] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice]   = useState<number>(0);
    const navigate = useNavigate();

    // initial load
    useEffect(() => {
        cartService.fetchCart()
            .then((data) => {
                setCartContent(data.products);
                setTotalPrice(data.totalPrice);
            })
            .catch(err => console.error('failed to load cart', err));
    }, []);

    const removeItem = async (id: string) => {
        try {
            const updatedCart = await cartService.deleteCartItem(id);
            setCartContent(updatedCart.products);
            setTotalPrice(updatedCart.totalPrice);
        }
        catch (error) {
            console.error('failed to remove item:', error);
        }
    };

    const clearCart = async () => {
        // optimistic clear
        setCartContent([]);
        setTotalPrice(0);
        try {
            const updatedCart = await cartService.updateCart({ products: [] });
            setCartContent(updatedCart.products);
            setTotalPrice(updatedCart.totalPrice);
        }
        catch (error) {
            console.error('failed to clear cart:', error);
        }
    };

    const confirmClear = () => {
        confirmDialog({
            message: 'are you sure you want to empty your cart?',
            header: 'confirm clear',
            icon: 'pi pi-exclamation-triangle',
            accept: clearCart
        });
    };

    const updateQty = async (item: CartItem, operation: 'increase' | 'decrease') => {
        // client update first for snappy feel
        const updatedProducts = cartContent.map(ci =>
            ci.id === item.id
                ? { ...ci, qty: operation === 'increase' ? ci.qty + 1 : Math.max(ci.qty - 1, 1) }
                : ci
        );
        const newTotal = updatedProducts.reduce((sum, p) => sum + p.price * p.qty, 0);
        setCartContent(updatedProducts);
        setTotalPrice(newTotal);

        // backend sync
        try {
            const updatedCart = await cartService.updateCart({ products: updatedProducts });
            setCartContent(updatedCart.products);
            setTotalPrice(updatedCart.totalPrice);
        }
        catch (error) {
            console.error('failed to update quantity:', error);
        }
    };

    // ── column body templates ──

    const titleBody = (row: CartItem) => (
        <span className={styles.productTitle}>{row.title}</span>
    );

    const qtyBody = (rowData: CartItem) => (
        <div className={styles.qtyControls}>
            <Button
                type="button"
                icon="pi pi-minus"
                className={`p-button-text ${styles.qtyBtn}`}
                onClick={() => updateQty(rowData, 'decrease')}
            />
            <span className={styles.qtyValue}>{rowData.qty}</span>
            <Button
                type="button"
                icon="pi pi-plus"
                className={`p-button-text ${styles.qtyBtn}`}
                onClick={() => updateQty(rowData, 'increase')}
            />
            <Button
                type="button"
                icon="pi pi-trash"
                className={`p-button-text ${styles.removeBtn}`}
                onClick={() => removeItem(rowData.id)}
                tooltip="remove item"
                tooltipOptions={{ position: 'top' }}
            />
        </div>
    );

    const priceBody = (row: CartItem) => (
        <span className={styles.priceCell}>
            ${(row.price * row.qty).toFixed(2)}
        </span>
    );

    return (
        <>
            <ConfirmDialog /> {/*primereact, used for clear all confirm*/}
            <NavBar />

            <div className={styles.cartPage}>
                    <div className={styles.headerRow}>
                        <h1 className={styles.pageTitle}>your cart</h1>
                        {cartContent.length > 0 && (
                            <span className={styles.itemCount}>{cartContent.length} item{cartContent.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {/*empty state  */}
                    {cartContent.length === 0 ? (
                        <div className={styles.emptyState}>
                            <i className="pi pi-shopping-cart" />
                            <p>your cart is empty</p>
                        </div>
                    ) : (
                        <div className={styles.cartPanel}>
                            <DataTable value={cartContent} dataKey="id" responsiveLayout="scroll">
                                <Column field="title"  header="product"  body={titleBody} />
                                <Column header="quantity" body={qtyBody} />
                                <Column header="price" body={priceBody} />
                            </DataTable>

                            <div className={styles.tableFooter}>
                                <div className={styles.totalBlock}>
                                    <span className={styles.totalLabel}>total</span>
                                    <span className={styles.totalValue}>${totalPrice.toFixed(2)}</span>
                                </div>

                                <div className={styles.footerActions}>
                                    <Button
                                        type="button"
                                        label="clear all"
                                        className={styles.clearBtn}
                                        onClick={confirmClear}
                                    />
                                    <Button
                                        type="button"
                                        label="checkout"
                                        
                                        iconPos="right"
                                        className={styles.checkoutBtn}
                                        onClick={() => navigate('/checkout')}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
        </>
    );
}
