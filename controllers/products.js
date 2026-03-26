//LOGIC OF WHAT HAPPENS
//DEV: MODEL -> CONTROLLER -> ROUTE
//CALL: ROUTE -> CONTROLLER -> ROUTE
const Product = require('../models/product');

// POST /admin/add-product
// Receives new product data from client and saves it to the database
// client sends { title, description, price }
exports.postAddProduct = async (req, res) => {
    try {
        console.log('Body:', req.body);//from frontend
        console.log('File:', req.file);

        const { title, description, price, stock, category } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || price == null || stock == null) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const product = new Product(title, description, price, stock, imageUrl, category);

        await product.save();
        res.status(201).json({ message: 'Product added', product });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        //read data from request, and fetch the page(pagination from model file)
        const {page,limit, category} = req.query;
        const {products,meta} = await Product.fetchPage({ page, limit,category: category || null });
        res.status(200).json({products,meta});//sent to frontend service
    } 
    catch (err) {
        console.error('Failed to fetch products:', err);
        res.status(500).json({ message: 'Failed to fetch all products' });
    }
};
//The request would look like:
//GET /products?page=1&limit=12&category=electronics

exports.putUpdateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('PUT /products/:id body:', req.body);
        console.log('PUT /products/:id file:', req.file);

        // fields come from FormData
        const { title, description, price, stock, category } = req.body;

        let imageUrl = null;
        if (req.file) {
        // new file uploaded mean set new image path
        imageUrl = `/uploads/${req.file.filename}`;
        } else {
        // if no new file then preserve existing imageUrl in DB
        const existing = await Product.findById(id);
        imageUrl = existing ? existing.imageUrl : null;
        }

        const newProductData = {
            title,
            description,
            price,
            stock,
            imageUrl,
            category: category || null 
        };

        const updated = await Product.updateById({ id, newProductData });

        // return the updated product
        res.json({ message: 'Product updated', product: updated });
    } 
        catch (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ error: 'Failed to update product' });
    }
};

{/*/ GET /products
exports.getProducts = async (req, res, next) => {
    try{
        const products = await Product.fetchAll();
        res.status(200).json(products);
    }
    catch(err){
            res.status(500).json({ message:'Failed to fetch all producs'});

    }
    
};
*/}

// GET /products/:id 
// Sends one specific product to client based on ID
// client receives one product
exports.getProductById = async(req,res,next)=>{
    const id = req.params.id;
    const product = await Product.findById(id);
    res.json(product);
}

// Deletes product from database based on ID sent from client
// Route: POST /products/admin/deleteProduct ,client sends { id }
exports.delProduct = async(req, res, next)=>{
    const id = req.body.id;
    const updatedProducts = await Product.deleteById(id);
    res.json({ message:'Product deleted successfully'});
}

// Updates a product in database using ID and new data from client
// Route: POST /products/admin/updateProduct , client sends { id, newProduct }
///----------OLD, USE putUpdateProduct instead!-----------------------
exports.updateProduct=async(req,res,next)=>{
    // id and updated data sent from frontend
    const id=req.body.id;
    const newProdData=req.body.newProductData;
    try {
        await Product.updateById({ id, newProductData: newProdData });
        res.json({ message: 'Product updated successfully' });
    } 
    catch (err) {
        res.status(404).json({ message: err.message || 'Failed to update product' });
    }
}
