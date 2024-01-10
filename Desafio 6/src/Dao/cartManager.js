import { cartModel } from './Models/cart.model.js';

export default class CartManagerDB {
    constructor() {
    }

    async addCart(cart) {
        return await cartModel.create(cart)
    }

    async getCartById(id) {
        const cart = await cartModel.findById(id)
        if (cart) {
            return cart
        } else {
            console.log('Cart not found')
            return null
        }
    }

    async getProductsInCart(cartId) {
        const cart = await this.getCartById(cartId)
        return cart ? cart.products : []
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId)

        const existingProductIndex = cart.products.findIndex(product => product.productId === productId)

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({ productId, quantity })
        }

        await cart.save()
        console.log("Product added to cart:", { cartId, productId, quantity })
    }
}
