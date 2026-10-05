const categoryModel = require('../models/categoryModel');


// create a new category
const createCategory = async (categoryData) => {

    const existingCategory = await categoryModel.findOne({ name: categoryData.name });
    if (existingCategory) {
        throw new Error('Category already exists');
    }

    const newCategory = await categoryModel.create(categoryData);
    return newCategory;

}


// get all categories
const getAllCategories = async () => {

    const categories = await categoryModel.find();
    return categories;
}


// get a category by id
const getCategoryById = async (id) => {

    const category = await categoryModel.findById(id);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
}


//update a category
const updateCategory = async (id, categoryData) => {

    const category = await categoryModel.findByIdAndUpdate(id, categoryData, { returnDocument: 'after',runValidators: true });
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
}

//delete a category
const deleteCategory = async (id) => {

    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
}


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}