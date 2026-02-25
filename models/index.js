const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../data.json');

const dataModel =  {
    findAll: async () => {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    },
    findById: async (id) => {
        const content = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(content);
        // for (let i=0; i<products.length; i++) {
        //     if (products[i].id == id) {
        //         return products[i];
        //     }
        // }
        const product = products.find(product => product.id == id);
        return product;
    },
    create: async (newProduct) => {
        const file = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(file);

        const id = products[products.length - 1].id + 1;
        newProduct.id = id;
        products.push(newProduct);

        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return newProduct
    },   
    update: async (id, updatedProduct) => {
        // read the data
        const file = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(file);

        // choose the data that need to be updated
        const product = products.find(product => product.id == id);

        // replace the current data with new value
        product.name = updatedProduct.name;
        product.description = updatedProduct.description;
        product.price = updatedProduct.price;
        product.stock = updatedProduct.stock;
        product.image_url = updatedProduct.image_url;  

        // write the data inside data.json
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));

        // return new data to the user
        return updatedProduct;
    },  
    delete: async (id) => {
        // read the data
        const content = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(content);

        if (id < 1) {
            return new Error('Invalid id');
        }

        // delete the data from array json
        const index = products.findIndex(product => product.id == id);
        console.log(index)

        products.splice(index, 1);


        // write the data inside data.json
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return undefined;
    }
}

module.exports = dataModel;