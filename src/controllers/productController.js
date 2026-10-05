const productService = require('../services/productService');
const removeUploadedFile = require('../utils/removeUploadedFile');



//Create a new product 

const newProduct = async (req, res) => {


    try {

        const productData = {
            ...req.body,
            image: req.file ? req.file.filename : ""
        }

        const product = await productService.CreateProduct(productData);
        res.status(201).json(product);

    } catch (err) {

        if (err.canRemoveUploadedFile === true) {
            await removeUploadedFile(req.file);
        }

        return res.status(400).json({
            message: err.message,
        });

    }
}

// Get all products

const allProducts = async (req, res) => {
    try {

        const products = await productService.GetAllProducts();

        res.status(200).json(products);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


// Get a product by id 

const getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.GetProductById(productId)
        res.status(200).json(product)

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

// Update a product 

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const productData =
        {
            ...req.body
        }

        if (req.file) {
            productData.image = req.file.filename
        }

        const updatedProduct = await productService.UpdateProduct(productId, productData);

        res.status(200).json(updatedProduct)

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Delete a product 

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await productService.DeleteProduct(productId);
        res.status(200).json(deletedProduct);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Search products by name 

const searchByName = async (req, res) => {
    try {
        const name = req.query.name;
        const products = await productService.SearchByName(name);
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Update a variant image 

const updateVariantImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'An image is required',
            });
        }

        const { productId, variantId } = req.params;

        const product = await productService.UpdateVariantImage(
            productId,
            variantId,
            req.file.filename
        );

        return res.status(200).json(product);

    } catch (err) {
        if (err.canRemoveUploadedFile === true) {
            await removeUploadedFile(req.file);
        }

        return res.status(400).json({
            message: err.message,
        });
    }
};




module.exports = {
    newProduct,
    allProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    searchByName,
    updateVariantImage
}

