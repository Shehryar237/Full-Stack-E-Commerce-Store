//COMUNICATeS WITH DB
//DEV: MODEL -> CONTROLLER -> ROUTE
//CALL: ROUTE -> CONTROLLER -> ROUTE
const fs=require('fs');
const {get} = require('http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const savePath = path.join(path.dirname(process.mainModule.filename),
        'data', 
        'products.json'
        );

const getProductsFromFile =()=> {
    //NOTE: THIS RETURNS A PROMISE, NOT A DIRECT ARARY
    return new Promise((resolve, reject)=>{
        const savePath = path.join(path.dirname(process.mainModule.filename),
        'data', 
        'products.json'
        );        
        fs.readFile(savePath,(err,fileContent)=>{
            if(err){
                console.log(err);
                resolve([]);
            }
            resolve(JSON.parse(fileContent));
        })
    })
}

module.exports= class Product{
    constructor(title, description, price){
        this.title = title;
        this.description = description;
        this.price=price;
        this.id = uuidv4().toString();
    }
    
    save(){
        getProductsFromFile().then((products)=>{
            products.push(this);
            fs.writeFile(savePath, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }
    
    static fetchAll(){
        return getProductsFromFile()
    }

    static async findById(id){
        let products = await getProductsFromFile();
        return products.find((product)=>product.id===id)||null;
    }

    static async deleteById(id){
        let products = await getProductsFromFile();
        let updatedProducts= products.filter(prod=>prod.id!=id);
        fs.writeFile(savePath, JSON.stringify(updatedProducts), err => {
                console.log(err);
            });
    }

    static async updateById({id,newProductData}){
        let products = await getProductsFromFile();
        let index = products.findIndex((prod) => prod.id === id);

        if (index === -1) {
            throw new Error('Product not found');
        }

        //take existing prod data and overwrite the specific fields, id must stay same
        products[index] = { ...products[index], ...newProductData, id };

        fs.writeFile(savePath, JSON.stringify(products), (err) => {
            if (err) console.log(err);
        });
    }
}