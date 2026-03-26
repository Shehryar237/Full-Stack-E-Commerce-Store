// read and write
const db = require('../util/db');

class CartModel {
    static async load(userId) {
        
        if (!userId) {
            // anonymous or invalid user
            return { products: [], totalPrice: 0 };
        }

        //try to find cart
        const cartQuery=`
            SELECT id,total_price FROM carts
            WHERE  user_id = $1
            LIMIT 1
        `
        let cartRes= await db.query(cartQuery,[userId]);

        if (cartRes.rows.length === 0) {
            return { products: [], totalPrice: 0 };
        }
        const { id: cartId, total_price } = cartRes.rows[0];
        const totalPrice = parseFloat(total_price)
        //NOTE: TOTAL PRICE COL IS NOW REDUNDANT, CAN REMOVE FROM DB TABLE

        const productQuery=`
            SELECT 
                cart_items.product_id,
                cart_items.quantity,
                products.title,
                products.price
            FROM cart_items
            JOIN products 
                ON products.id = cart_items.product_id
            WHERE cart_items.cart_id = $1
        `
        const itemsRes = await db.query(productQuery, [cartId]);

        //final response
        const products = itemsRes.rows.map(row => ({
            id:    row.product_id,
            qty:   row.quantity,
            title: row.title,
            price: parseFloat(row.price)
        }));

        return { products, totalPrice };
    }

    static async save(userId, cart) {
        if (!userId) return;
        await db.query('BEGIN');
        try{ 
            let cartRes = await db.query(`SELECT id FROM carts WHERE user_id=$1 LIMIT 1`,[userId]);
            let cartId = cartRes.rows[0]?.id;
            if(!cartId){
                 // if no existing cart
                const insertRes = await db.query(
                    `INSERT INTO carts (user_id, total_price) VALUES ($1, $2) RETURNING id`,
                    [userId, cart.totalPrice||0]
                );
                cartId = insertRes.rows[0].id;
            }           
            else {
                await db.query(`DELETE from cart_items WHERE cart_id = $1`,[cartId]);              
                //update  total price, price is updated inside carts table not cart_items
                // set optimistic total, recompute after inserts)
                await db.query(
                    `UPDATE carts SET total_price = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
                    [cart.totalPrice || 0, cartId]
                );
            }

            // insert all current items
             if (Array.isArray(cart.products) && cart.products.length > 0) {
                const insertStmt = `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`;
                for (const product of cart.products) {
                    const qty = Math.max(parseInt(product.qty, 10) || 0, 1);
                    await db.query(insertStmt, [cartId, product.id, qty]);
                }
            }

            //update total price
            // calculate total price from DB
            const totalRes = await db.query(
                `SELECT SUM(ci.quantity * p.price) AS total
                FROM cart_items ci
                JOIN products p ON p.id = ci.product_id
                WHERE ci.cart_id = $1`,
                [cartId]
            );

            const totalPrice = parseFloat(totalRes.rows[0].total) || 0;
            await db.query(
                `UPDATE carts SET total_price = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
                [totalPrice, cartId]
            );

            await db.query('COMMIT');
            // return fresh cart
            return await this.load(userId);

        }
        catch(err){
            await db.query('ROLLBACK');
            throw err;
        }
    }
    

    static async del(productId,userId) {
        if(!userId){
            return { products: [], totalPrice: 0 };
        }
        const cartRes = await db.query(`SELECT id FROM carts WHERE user_id = $1 LIMIT 1`,[userId]);
        if (cartRes.rows.length === 0) return { products: [], totalPrice: 0 };
        const cartId = cartRes.rows[0].id;

        //delete the item from cart_items table
        await db.query('BEGIN');
        try{
            await db.query(
            `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
            [cartId, productId]
            );
            // calc total price
            const totalRes = await db.query(
                `SELECT SUM(ci.quantity * p.price) AS total
                FROM cart_items ci
                JOIN products p ON p.id = ci.product_id
                WHERE ci.cart_id = $1`,
                [cartId]
            );
            const totalPrice = parseFloat(totalRes.rows[0].total) || 0;
            //update the cart total price in the db
            await db.query(
                `UPDATE carts SET total_price = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [totalPrice, cartId]
            );
            await db.query('COMMIT');

            // return updated cart
            return await this.load(userId);
            } 
        catch(err){
            await db.query('ROLLBACK');
            throw err;
        }
    }
}

    module.exports = CartModel;
