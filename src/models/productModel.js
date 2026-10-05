const mongoose = require('mongoose');




const variantSchema = new mongoose.Schema({

    sku: {
        type: String,
        required: true,
        uppercase: true,

    },
    attributes: {
        type: [{
            name: {
                type: String,
                required: true,
                trim: true,
                minlength: 1,
            },
            value: {
                type: String,
                required: true,
                trim: true,
                minlength: 1,
            },
        }],
        validate: {
            validator: function (attributes) {
                if (!Array.isArray(attributes)) {
                    return false;
                }

                const names = attributes
                    .filter(attribute => typeof attribute?.name === 'string')
                    .map(attribute => attribute.name.trim().toLowerCase());

                const uniqueNames = new Set(names);

                return uniqueNames.size === names.length;
            },
            message: 'Attribute names must not repeat within a variant',
        },
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        validate: {
            message: 'Stock must be an integer',
            validator: Number.isInteger,
        }
    },
    image: {
        type: String,
        default: '',
    }
})


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },

    variants: {

        type: [variantSchema],
        validate: {
            validator: array => Array.isArray(array) && array.length > 0,
            message: 'At least one variant is required',
        }
    },

},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);


