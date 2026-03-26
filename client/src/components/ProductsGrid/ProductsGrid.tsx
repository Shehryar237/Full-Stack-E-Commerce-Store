import { useState, useEffect, useRef } from "react";
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
    category?:string
}

export default function ProductsGrid({ isAdmin,category }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [editOpened, setEditOpened] = useState(false);
    const [current, setCurrent] = useState<Product | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // pagination state
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(12); // items per page
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // load page
    const loadPage = async (p = page, l = limit) => {
        setLoading(true);
        setError(null);
        try {
            const data = await productServices.fetchProducts(p, l, category);
            setProducts(data.products);
            setPage(data.meta.page);
            setLimit(data.meta.limit);
            setTotalPages(data.meta.totalPages);
            setTotalItems(data.meta.total);
            // if current page has no items (e.g. after delete) and page > 1, go back one page
            if (data.products.length === 0 && data.meta.page > 1) {
                const prev = Math.max(1, data.meta.page - 1);
                await loadPage(prev, l);
            }
        } catch (err) {
            console.error("Failed to load products", err);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const isFirstRender = useRef(true)

     //fires when category filter changes
    useEffect(() => {
        loadPage(1, limit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    //fires when user navigates pages or changes items per page
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // skip on first render, already handled above
        }
        loadPage(page, limit);// only runs on subsequent page/limit changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]);

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
        // optimistically remove from UI
        setProducts(prev => prev.filter(p => p.id !== deleteTargetId));
        try {
            await productServices.postDeleteProduct(deleteTargetId);
            // refetch page so meta stays accurate
            await loadPage(page, limit);
        } catch (err) {
            console.error("Could not delete product", err);
            // revert by refetching
            await loadPage(page, limit);
        } finally {
            setDeleteLoading(false);
            setDeleteConfirmOpen(false);
            setDeleteTargetId(null);
        }
    };

    // Save (add/edit)
    const handleSave = async (
        id: string | undefined,
        updatedFields: ProductData,
        imageFile?: File | null
    ) => {
        try {
            if (!id) {
                // Add new product — server will include it; refetch current page (or go to page 1)
                await productServices.postAddProduct(
                    updatedFields.title,
                    updatedFields.description,
                    updatedFields.price,
                    updatedFields.stock,
                    imageFile
                );
                // After add, load first page (or you could load current page)
                await loadPage(1, limit);
            } else {
                // Edit product
                await productServices.editProdById(id, updatedFields, imageFile);
                // refetch current page so we get updated product & image path
                await loadPage(page, limit);
            }
        } catch (error) {
            console.error("Could not save product", error);
        }
    };

    // pagination controls
    const goFirst = () => setPage(1);
    const goPrev = () => setPage(p => Math.max(1, p - 1));
    const goNext = () => setPage(p => Math.min(totalPages, p + 1));
    const goLast = () => setPage(totalPages);
    const onPageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseInt(e.target.value || "1", 10) || 1;
        setPage(Math.min(Math.max(1, v), totalPages));
    };
    const onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const l = parseInt(e.target.value || "12", 10) || 12;
        setLimit(l);
        setPage(1); // reset to first page when changing limit
    };

    return (
        <>
            {/* keep the same grid and look */}
            <div className={styles.productsgrid}>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    products.map((product, index) => (
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
                    ))
                )}
            </div>

            {/*pagination controls */}
            <div className={styles.pagination}>
                <div className={styles.pageNav}>
                    <Button className={styles.paginControl} label="First" onClick={goFirst} disabled={page <= 1} />
                    <Button className={styles.paginControl} label="Prev" onClick={goPrev} disabled={page <= 1} />
                    <span className={styles.pageText}>
                        Page{' '}
                        <input
                        type="number"
                        value={page}
                        onChange={onPageInput}
                        className={styles.pageInput}
                        min={1}
                        max={totalPages}
                        />{' '}
                        of {totalPages}
                    </span>
                    <Button className={styles.paginControl} label="Next" onClick={goNext} disabled={page >= totalPages} />
                    <Button className={styles.paginControl} label="Last" onClick={goLast} disabled={page >= totalPages} />
                </div>

                <div className={styles.itemLimit}>
                    <label>
                        Items per page:
                        <select value={limit} onChange={onLimitChange} style={{ marginLeft: 8 }}>
                            <option value={6}>6</option>
                            <option value={9}>9</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                        </select>
                    </label>
                    <div style={{ marginLeft: 12 }}>
                        Total: {totalItems}
                    </div>
                </div>
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
