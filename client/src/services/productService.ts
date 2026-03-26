/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:5000/products';
import { useAuthStore } from '../stores/useAuthStore';
import type { ProductData } from '../components/productModal/productModal';

export type Product = {
    title: string;
    id: string;
    price: number;
    stock: number;
    description: string;
    imageUrl?: string;
    qty?: number;
}

function getAuthHeaders(isMultipart = false) {
    const token = useAuthStore.getState().token;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
}
{/*
export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(API_BASE);
    return (await res.json() as Product[]);
}
*/}

// client/src/services/productService.ts
export async function fetchProducts(page = 1, limit = 12, category?: string): Promise<{
    products: Product[];
    meta: { total: number; page: number; limit: number; totalPages: number };
    }
    > 
    {
        const q = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (category) q.append('category', category);

        const res = await fetch(`${API_BASE}?${q.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        return (await res.json()) as {
            products: Product[];
            meta: { total: number; page: number; limit: number; totalPages: number };
    };
}


export async function fetchProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/${id}`);
    return (await res.json() as Product);
}

export async function postAddProduct(
    title: string,
    description: string,
    price: number,
    stock: number,
    imageFile?: File | null
): Promise<any> {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('price', String(price || 0));
    fd.append('stock', String(stock || 0));

    if (imageFile) {
        fd.append('image', imageFile);
    } else {
        console.log("No file found, imageFile is", imageFile);
    }

    const res = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${useAuthStore.getState().token || ""}`,
        },
        body: fd,
    });

    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
}

export async function postDeleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/admin/deleteProduct`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to delete product');
}

export async function editProdById(
    id: string,
    updatedFields: ProductData,
    imageFile?: File | null  
    ) {
    const fd = new FormData();
    fd.append("title", updatedFields.title);
    fd.append("description", updatedFields.description);
    fd.append("price", String(updatedFields.price || 0));
    fd.append("stock", String(updatedFields.stock || 0));

    if (imageFile) {
        fd.append("image", imageFile);
    }

    const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
        Authorization: `Bearer ${useAuthStore.getState().token || ""}`,
        },
        body: fd,
    });

    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}

{/* How these three pieces work together (flow)

Frontend calls fetchProducts(page, limit) → creates GET /products?page=2&limit=12.

Express controller getProducts receives req.query, calls Product.fetchPage({ page, limit }).

Model runs COUNT(*) and SELECT ... LIMIT ... OFFSET ..., maps rows, returns { products, meta }.

Controller returns { products, meta } JSON to client.

UI receives both list and paging info and renders UI controls accordingly.*/}