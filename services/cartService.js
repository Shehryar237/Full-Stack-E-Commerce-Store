// logic 
const CartModel = require('../models/cartModel');

async function addItem(userId, id, title, price){
    const cart = await CartModel.load(userId); //if we have cart read, else new
    
    const existing = cart.products.find(p=>p.id===id);
    if(existing){
        if (existing.qty)
            existing.qty++;
    }
    else{
        cart.products.push({id, qty:1, title, price});
    }
    cart.totalPrice+=price;
    const updatedCart = CartModel.save(userId, cart);
    return updatedCart;
}

async function fetchCart(userId){
    return await CartModel.load(userId); //if we have cart read, else new
}

async function updateCart(userId, cart){
    return CartModel.save(userId,cart); //Gives promise 
}

async function delCartItem(userId, id){
    return CartModel.del(id,userId);
}

async function mergeCart(userId, localCart) {
    if (!userId) {
        //should never happen because route has authMiddleware
        return { products: [], totalPrice: 0 };
    }

    //load the existing db cart for user
    const dbCart = await CartModel.load(userId);

    // array map for better efficeiny, it would be O(n)2 otherewise
    const mergedMap = new Map();
    // add db cart items 
    for (const item of dbCart.products) {
        mergedMap.set(item.id, {
            id: item.id,
            title: item.title,
            price: item.price,
            qty: item.qty
        });
    }

    // merge in localStorage cart
    for (const item of localCart.products || []) {
        if (mergedMap.has(item.id)) {
            // if item exists , add qty
            mergedMap.get(item.id).qty += item.qty;
        } 
        else {
            // if new, then add entryt
            mergedMap.set(item.id, {
                id: item.id,
                title: item.title,
                price: item.price,
                qty: item.qty
            });
        }
    }

    // map back to array
    const mergedProducts = Array.from(mergedMap.values());

    const totalPrice = mergedProducts.reduce(
        (sum, p) => sum + p.price * p.qty,
        0
    );

    //merged cart obj
    const finalCart = {
        products: mergedProducts,
        totalPrice
    };

    await CartModel.save(userId, finalCart);
    return await CartModel.load(userId);
}

module.exports = { addItem, fetchCart, updateCart,delCartItem,mergeCart };