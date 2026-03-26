import { useState, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard"
import styles from './ProductsGrid.module.css';
import * as productServices from '../../services/productService';
import ProductModal from '../../components/productModal/productModal';
import type { ProductData } from '../../components/productModal/productModal';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

type Product = {
    title: string;
    id: string;
    price: number;
    stock: number;
    description: string;
    imageUrl?: string;
    qty?: number;
}

type Props = {
    isAdmin?: boolean;
}

export default function ProductsGrid({ isAdmin }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [editOpened, setEditOpened] = useState(false);
    const [current, setCurrent] = useState<Product | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        productServices.fetchProducts()
            .then((data: Product[]) => setProducts(data))
            .catch((err: unknown) => console.error("Failed to load products", err));
    }, []);

    const handleEdit = (prod: Product) => {
        setCurrent(prod);
        setEditOpened(true);
    };

    // del modal logic
    const requestDelete = (id: string) => {
        setDeleteTargetId(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        setProducts(prev => prev.filter(p => p.id !== deleteTargetId));
        try {
            await productServices.postDeleteProduct(deleteTargetId);
        } catch (err) {
            console.error("Could not delete product", err);
        }
        setDeleteLoading(false);
        setDeleteConfirmOpen(false);
        setDeleteTargetId(null);
    };

    // Save 
    const handleSave = async (
        id: string | undefined,
        updatedFields: ProductData,
        imageFile?: File | null
    ) => {
        try {
            if (!id) {
                // new prod
                const newProd = await productServices.postAddProduct(
                    updatedFields.title,
                    updatedFields.description,
                    updatedFields.price,
                    updatedFields.stock,
                    imageFile
                );
                setProducts(prev => [...prev, newProd.product]);
            } 
            else {
                // edit product
                await productServices.editProdById(id, updatedFields, imageFile);
                setProducts(prev =>
                    prev.map(p =>(p.id === id ? { ...p, ...updatedFields } : p))
                );
            }
        } catch (error) {
            console.error("Could not save product", error);
        }
    };

    return (
        <>
            <div className={styles.productsgrid}>
                {products.map((product, index) => (
                    <ProductCard
                        key={product.id ?? index}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        stock={product.stock}
                        description={product.description}
                        isAdmin={isAdmin}
                        imageUrl={product.imageUrl}
                        onDelete={isAdmin ? requestDelete : undefined}
                        onEdit={isAdmin ? handleEdit : undefined}
                    />
                ))}
            </div>
            <ProductModal
                opened={editOpened}
                title="Edit Product"
                initialData={
                    current
                        ? {
                            title: current.title,
                            description: current.description,
                            price: current.price,
                            stock: current.stock,
                        }
                        : undefined
                }
                id={current?.id}
                onClose={() => setEditOpened(false)}
                onSubmit={handleSave}
            />
            <Dialog
                header="Confirm Delete"
                visible={deleteConfirmOpen}
                onHide={() => setDeleteConfirmOpen(false)}
                style={{ width: '30vw' }}
                modal
                footer={
                    <div className="flex justify-end gap-2">
                        <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteConfirmOpen(false)} className="p-button-text" />
                        <Button label="Delete"
                            icon="pi pi-trash"
                            className="p-button-danger"
                            onClick={confirmDelete}
                            loading={deleteLoading}
                        />
                    </div>
                }
            >
                <p>Are you sure you want to delete this product?</p>
            </Dialog>
        </>
    )
}
