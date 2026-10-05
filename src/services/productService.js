const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');



// Create a new product 

const CreateProduct = async (productData) => {

    let saveStarted = false


    try {

        const category = await Category.findById(productData.category);

        if (!category) {
            throw new Error('Category not found');
        }

        saveStarted = true;

        const product = await Product.create(productData)


        return product;
    } catch (err) {
        err.canRemoveUploadedFile = !saveStarted;
        throw err;
    }
}



// Get all products

const GetAllProducts = async () => {

    const products = await Product.find().populate('category', 'name');

    return products;

}


// Get a product by id

const GetProductById = async (id) => {

    const product = await Product.findById(id).populate('category', 'name');

    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}


// Update a product 

const UpdateProduct = async (id, productData) => {
    if (
        !productData ||
        typeof productData !== 'object' ||
        Array.isArray(productData) ||
        Object.keys(productData).length === 0
    ) {
        throw new Error('Product update data is required');
    }

    if (
        productData.variants !== undefined &&
        !Array.isArray(productData.variants)
    ) {
        throw new Error('Variants must be an array');
    }

    if (productData.category !== undefined) {
        const category = await Category.findById(productData.category);

        if (!category) {
            throw new Error('Category not found');
        }
    }

    const product = await Product.findByIdAndUpdate(
        id,
        { $set: productData },
        {
            returnDocument: 'after',
            runValidators: true,
        }
    ).populate('category', 'name');

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
};

// Delete a product 

const DeleteProduct = async (id) => {

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new Error('Product not found');
    }

    return product;

}

// Search products by name 

const SearchByName = async (name) => {
    if (typeof name !== 'string' || !name.trim()) {
        throw new Error('A search name is required');
    }

    const searchTerm = name.trim();

    if (searchTerm.length > 100) {
        throw new Error('Search must not exceed 100 characters');
    }

    const escapedName = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const products = await Product.find({
        name: mongoose.trusted({
            $regex: escapedName,
            $options: 'i',
        }),
    }).populate('category', 'name');

    if (products.length === 0) {
        throw new Error('Product not found');
    }

    return products;
};



const UpdateVariantImage = async (productId, variantId, filename) => {
    let saveStarted = false;

    try {
        if (typeof filename !== 'string' || !filename.trim()) {
            throw new Error('An image is required');
        }

        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        const variant = product.variants.id(variantId);

        if (!variant) {
            throw new Error('Variant not found');
        }

        variant.image = filename;

        saveStarted = true;
        await product.save();

        return product;
    } catch (error) {
        error.canRemoveUploadedFile = !saveStarted;
        throw error;
    }
};




module.exports = {
    CreateProduct,
    GetAllProducts,
    GetProductById,
    UpdateProduct,
    DeleteProduct,
    SearchByName,
    UpdateVariantImage
}