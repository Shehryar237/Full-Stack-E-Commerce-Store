//COMUNICATeS WITH DB
//DEV: MODEL -> CONTROLLER -> ROUTE
//CALL: ROUTE -> CONTROLLER -> ROUTE
const db = require('../util/db');
const { v4: uuidv4 } = require('uuid');

module.exports = class Product {
    constructor(title, description, price, stock, imageUrl, category=null) {
        this.id = uuidv4().toString();
        this.title = title;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.category = category;
        //the product object is only ever used to transport data 
        //from client to db
        //in product controller
    }

    async save() {
        const query = `
            INSERT INTO products (id, title, description, price, stock, image_url, category)
            VALUES ($1, $2, $3, $4, $5, $6, ^7)
            RETURNING *;
        `;
        const values = [
            this.id,
            this.title,
            this.description,
            this.price,
            this.stock,
            this.imageUrl,
            this.category=category
        ];
        const result = await db.query(query, values);
        return Product.mapRow(result.rows[0]);
    }


    static async fetchAll() {
        const result = await db.query('SELECT * FROM products');
        return result.rows.map(Product.mapRow);
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0] ? Product.mapRow(result.rows[0]) : null;
    }

    static async deleteById(id) {
        await db.query('DELETE FROM products WHERE id = $1', [id]);
        //cascade handling to be added later
    }

    static async fetchPage({ page =1, limit =12,category = null }) {
        const pageNum = Math.max(parseInt(page, 10)|| 1, 1);
        const lim = Math.max(parseInt(limit, 10) ||12, 1);
        const offset = (pageNum - 1) * lim; //sql pagination

         // build where clause only if category was passed
        const where  = category ? `WHERE category = $3` : '';
        const params = category ? [lim, offset, category] : [lim, offset];

        // total count
        //can cause problem for large set , try caching or aproximation later
        //const totalRes = await db.query('SELECT COUNT(*) AS count FROM products');
        const totalRes = await db.query(
            category
                ? 'SELECT COUNT(*) AS count FROM products WHERE category = $1'
                : 'SELECT COUNT(*) AS count FROM products',
            category ? [category] : []
        );
        //check if nothing returned from db
        const total = parseInt(totalRes.rows[0].count, 10) || 0;


        // get page rows(order by created_at desc so newest first)
        const result = await db.query(
            `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            params
        );

        const products = result.rows.map(Product.mapRow);

        return {
            products,
            meta: {
                total,
                page: pageNum,
                limit: lim,
                totalPages: Math.max(Math.ceil(total / lim), 1)
            }
        };
    }


    static async updateById({ id, newProductData }) {
        const { title, description, price, stock, imageUrl, category } = newProductData;

        const query = `
            UPDATE products SET 
                title = $1, 
                description = $2, 
                price = $3,
                stock = $4,
                image_url = $5,
                category = $6,  
                updated_at = NOW()
            WHERE id = $7
            RETURNING *;
        `;
        const values = [
            title,
            description,
            price,
            stock || 0,
            imageUrl || null,
            category || null,
            id
        ];
        const result = await db.query(query, values);
        return Product.mapRow(result.rows[0]);
    }

    //  maps snake to camel
    static mapRow(row) {
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            price: parseFloat(row.price)||0,
            stock: row.stock,
            imageUrl: row.image_url,  //snake case to camel Case
            category:  row.category,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
};

//TODO, FETCH USER COUNT, PRODUCT COUNT
