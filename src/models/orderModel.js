const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },
    userName: {
        type: String,
        required: true,
    },
    shippingAdresse: {
        type: String,
        required: true,
    },
    shippingCity: {
        type: String,
        enum: [
            'Adrar', 'Aïn Defla', 'Aïn Témouchent', 'Algiers', 'Annaba', 'Batna',
            'Béchar', 'Béjaïa', 'Béni Abbès', 'Biskra', 'Blida', 'Bordj Badji Mokhtar',
            'Bordj Bou Arréridj', 'Bouira', 'Boumerdès', 'Chlef', 'Constantine', 'Djanet',
            'Djelfa', 'El Bayadh', 'El MGhair', 'El Menia', 'El Oued', 'El Tarf',
            'Ghardaïa', 'Guelma', 'Illizi', 'In Guezzam', 'In Salah', 'Jijel',
            'Khenchela', 'Laghouat', 'MSila', 'Mascara', 'Médéa', 'Mila', 'Mostaganem',
            'Naâma', 'Oran', 'Ouargla', 'Ouled Djellal', 'Oum El Bouaghi', 'Relizane',
            'Saïda', 'Sétif', 'Sidi Bel Abbès', 'Skikda', 'Souk Ahras', 'Tamanrasset',
            'Tébessa', 'Tiaret', 'Timimoun', 'Tindouf', 'Tipaza', 'Tissemsilt',
            'Tizi Ouzou', 'Tlemcen', 'Touggourt'
        ],
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        match: [/^\d{10}$/, 'Phone number must contain exactly 10 digits']
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
                validate: {
                    validator: Number.isInteger,
                    message: 'Quantity must be an integer',
                },
            },
            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            sku: {
                type: String,
                required: true,
            },
            attributes: [{
                name: {
                    type: String,
                    required: true,
                },
                value: {
                    type: String,
                    required: true,
                },
            }]
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },

    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid',
    },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

