
const API_BASE = 'http://localhost:5000/cart';
import { useAuthStore } from '../stores/useAuthStore';

export type CartItem = {
    id:    string;
    title: string;
    price:number;
    qty:   number;
};

export type Cart = {
    products: CartItem[];
    totalPrice: number;
};

export type CheckoutReceipt = {
    success: boolean;
    message: string;
    orderId: string;
    totalPaid: number;
    date: string;
};

//guest user, not logged in
const LOCAL_KEY = 'local_cart_v1';

function getAuthHeaders() {
    const token = useAuthStore.getState().token;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

function readLocalCart():Cart{
    try{
        const raw=localStorage.getItem(LOCAL_KEY);
        if(!raw) return{products:[],totalPrice:0}
        const parsed = JSON.parse(raw);
        const products: CartItem[] = Array.isArray(parsed.products) ? parsed.products : [];
        const totalPrice = products.reduce((s, p) => s + (p.price || 0) * (p.qty || 0), 0);
        return { products, totalPrice };
    }
    catch{
        return { products: [], totalPrice: 0 };
    }
}

function writeLocalCart(cart: Cart) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ products: cart.products || [] }));
}

export async function addProductToCart(id:string, title:string, price:number){
    try{
        const token = useAuthStore.getState().token;
        //GUEST USER
        if (!token) {
        // anonymous: update localStorage
        const cart = readLocalCart();
        const idx = cart.products.findIndex(p => p.id === id);
        if (idx >= 0) cart.products[idx].qty += 1;
        else cart.products.push({ id, title, price, qty: 1 });
        cart.totalPrice = cart.products.reduce((s, p) => s + p.price * p.qty, 0);
        writeLocalCart(cart);
        return cart;
    }
    
    //LOGGED IN 
    //send ID to backend and capure response
    const res = await fetch(`${API_BASE}/addItem`,{
        method:'POST',
        headers:getAuthHeaders(),
        body: JSON.stringify({id:id, title:title, price:price}),
    });

    //const data = await res.json();
    //console.log(data);
    //console.log("PRODUCT ADDED");
    if (!res.ok) throw new Error('Failed to add product to cart');
    return (await res.json()) as Cart;
    }   
    catch(err){
        console.log(err);
    }
}

export async function fetchCart(): Promise<Cart> {
    const token = useAuthStore.getState().token;
    if (!token) {
        return readLocalCart();
    }
    const res = await fetch(`${API_BASE}`,
        { method: 'GET' ,
            headers:getAuthHeaders(),
        });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return (await res.json()) as Cart;
}

export async function updateCart(cart:{ products: CartItem[] }){
    const token = useAuthStore.getState().token;
    if (!token) {
        const local: Cart = { products: cart.products, totalPrice: cart.products.reduce((s, p) => s + p.price * p.qty, 0) };
        writeLocalCart(local);
        return local;
    }

    const res = await fetch(`${API_BASE}/updateCart`,{
        method:'POST',
        headers:getAuthHeaders(),
        body: JSON.stringify(cart),
    });
    if (!res.ok) throw new Error('Failed to update cart');
    return (await res.json()) as Cart;
}

export async function deleteCartItem(id:string){
    const token = useAuthStore.getState().token;
    if (!token) {
        const cart = readLocalCart();
        const products = cart.products.filter(p => p.id !== id);
        const newCart = { products, totalPrice: products.reduce((s, p) => s + p.price * p.qty, 0) };
        writeLocalCart(newCart);
        return newCart;
    }
    const res = await fetch(`${API_BASE}/deleteCartItem`, {
        method:'POST',
        headers:getAuthHeaders(),
        body: JSON.stringify({id}),
        }
    )
    if (!res.ok) throw new Error('Failed to update cart');
    return (await res.json()) as Cart;
}

export async function mergeLocalCartOnLogin() {
    const token = useAuthStore.getState().token;
    if (!token) return null;
    const local = readLocalCart();
    if (!local.products || local.products.length === 0) return null;
    const res = await fetch(`${API_BASE}/merge`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(local)
    });
    if (!res.ok) throw new Error('Failed to merge local cart');
    const merged = (await res.json()) as Cart;
    // clear local cart only after successful merge
    localStorage.removeItem(LOCAL_KEY);
    return merged;
}

export async function checkout(paymentInfo: Record<string, unknown>): Promise<CheckoutReceipt> {
    const res = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ payment: paymentInfo })
    });
    if (!res.ok) throw new Error('Checkout failed');
    return (await res.json()) as CheckoutReceipt;
}
export default {
};