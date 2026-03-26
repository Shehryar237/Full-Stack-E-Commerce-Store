import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { Button} from 'primereact/button';
import * as cartService from '../../services/cartService';
import styles from './CartPage.module.css';
import type { CartItem } from '../../services/cartService';
import NavBar from '../../components/layout/NavBar/Navbar';

export default function CartPage() {
    const [cartContent, setCartContent] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(()=>{
      //initial load
        cartService.fetchCart().then((data)=>{
          setCartContent(data.products);
          setTotalPrice(data.totalPrice);
        })
        .catch(err => console.error('Failed to load cart', err))
    },[]);

  const removeItem = async (id: string) => {
    {/*--------OLD LOGIC-------------
      setCartContent(prev => {
      //functional state setter, otherwise stale data overwrites
      const updated = prev.filter(item => item.id !== id);

      const newTotal = updated.reduce((sum, p)=>sum + p.price * p.qty, 0);
      setTotalPrice(newTotal);

      cartService
        .deleteCartItem(id)
        .catch(console.error);

      return updated;
    });*/}

    try{
      const updatedCart=await cartService.deleteCartItem(id);
      setCartContent(updatedCart.products);
      setTotalPrice(updatedCart.totalPrice);
    }
    catch(error){
      console.error('Failed to remove item:', error);
    }
  };

  const clearCart = async () => {
    setCartContent([]);
    setTotalPrice(0);
    try{
      const updatedCart=await cartService.updateCart({ products: []});
      setCartContent(updatedCart.products);;
      setTotalPrice(updatedCart.totalPrice);
    }
    catch(error){
        console.error('Failed to clear cart:', error);
    }
    
  }

  const confirmClear = () => {
    confirmDialog({
        message: 'Are you sure you want to empty your cart?',
        header: 'Confirm Clear',
        icon: 'pi pi-exclamation-triangle',
        accept: clearCart
      });
  };

  const updateQty = async (item: CartItem, operation: 'increase' | 'decrease') => {
    {/*OLD LOGIC
          setCartContent(prev => {   
        const updated = prev.map(ci =>
          ci.id === item.id
              ? { ...ci,qty: operation==='increase' ? ci.qty + 1 : ci.qty - 1 }
              : ci
        );

        //price update
        const newTotal = updated.reduce((sum, p)=>sum + p.qty * p.price, 0);
        setTotalPrice(newTotal);

        //backend sync
        cartService.updateCart({ products: updated, totalPrice: newTotal })
          .catch(console.error);

        return updated;
    });
    */}
    
    //CLIENT UPDATE
    const updatedProducts = cartContent.map(ci =>
      ci.id === item.id
        ? { ...ci, qty: operation === 'increase' ? ci.qty + 1 : Math.max(ci.qty - 1, 1) }
        : ci
    );

    const newTotal = updatedProducts.reduce((sum, p) => sum + p.price * p.qty, 0);


    setCartContent(updatedProducts);
    setTotalPrice(newTotal);
    //BACKEND SYNC
    try{
      const updatedProducts = cartContent.map(ci =>
        ci.id === item.id
          ? { ...ci, qty: operation === 'increase' ? ci.qty + 1 : Math.max(ci.qty - 1, 1) }
          : ci
      );

      const updatedCart = await cartService.updateCart({products:updatedProducts})
      
      setCartContent(updatedCart.products);
      setTotalPrice(updatedCart.totalPrice);
  }
    catch(error){
      console.error('Failed to update quantity:', error);
    }   
  }
    return (
    <>
    <ConfirmDialog /> {/*primereact, used for clearall*/}
    <NavBar/>
    <div className={styles.cartPage}>
      <div className={styles.cartPanel}>
        <h2>Your Cart</h2>
        <DataTable value={cartContent} dataKey="id"  responsiveLayout="scroll">
          <Column field="title" header="Product" />
            <Column
              header="Quantity"
              body={(rowData) => (
                <div className={styles.qtyControls}>
                  <Button type="button"
                    icon="pi pi-minus"
                    className="p-button-text p-button-rounded"
                    onClick={()=>updateQty(rowData, 'decrease')}
                  />
                  <span className={styles.qtyValue}>{rowData.qty}</span>
                  <Button type="button"
                    icon="pi pi-plus"
                    className="p-button-text p-button-rounded"
                    onClick={()=>updateQty(rowData, 'increase')}
                  />

                  <Button type="button"
                    icon="pi pi-trash"
                    className="p-button-text p-button-rounded"
                    onClick={()=>removeItem(rowData.id)}
                  />
                </div>
              )}
            />

          <Column
            field="price"
            header="Price"
            body={(row) => `$${(row.price * row.qty).toFixed(2)}`}
            footer={<strong>{`$${totalPrice.toFixed(2)}`}</strong>}
          />
      
        </DataTable>
          <div className={styles.tableFooter}>
              <Button type="button"
                label="Checkout"
                className={styles.checkoutBtn}
              />

              <Button type="button"
                label="Clear All"
                className={styles.clearBtn}
                onClick={confirmClear}
              />
        </div>
      </div>
    </div>
    </>
  );
}
