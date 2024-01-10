import mongoose from 'mongoose';

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },

    products: Array
},
    {
        timestamps: true
    })

cartSchema.statics.getNextId = async function () {
    const lastCart = await this.findOne({}, {}, { sort: { 'id': -1 } })
    return (lastCart && lastCart.id + 1) || 1
}

cartSchema.statics.createWithNextId = async function () {
    const nextId = await this.getNextId()
    return this.create({ id: nextId, products: [] })
}


export const cartModel = mongoose.model(cartCollection, cartSchema)