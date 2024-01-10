import { cartModel } from "./Models/cart.model.js";
import { productModel } from "./Models/product.model.js";

export default class CartManagerDB {
    async addCart() {
        const newCart = await cartModel.createWithNextId()
        return newCart

    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            // Carrito por ID
            const cart = await cartModel.findOne({ id: cartId })

            if (!cart) {
                console.log('Cart not found')
                throw new Error("Cart not found")
            }

            // Producto por ID
            const product = await productModel.findOne({ id: productId })

            if (!product) {
                console.log('Product not found')
                throw new Error("Product not found")
            }

            // Verificamos si el producto ya esta en el carrito
            const existingProduct = cart.products.find(p => p.productId.toString() === productId)

            if (existingProduct) {
                // Si el producto ya esta en el carrito, aumentamos la cantidad
                existingProduct.quantity += quantity
            } else {
                // Si el producto no está en el carrito, se añade
                cart.products.push({ productId, quantity })
            }

            await cart.save()

            // Mensaje
            const message = `Product added to cart: ${cartId}, ${product.title}, quantity: ${quantity}`

            console.log(message)
            return message
        } catch (error) {
            console.error('Error adding product to cart:', error.message)
            throw error
        }
    }

    async getCarts() {
        const carts = await cartModel.find()
        return carts
    }

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findOne({ id: cartId })

            if (cart) {
                return cart
            } else {
                console.log('Cart not found')
                return null
            }
        } catch (error) {
            console.error('Error getting cart by ID:', error.message)
            throw error
        }
    }

    async getProductsInCart(cartId) {
        const cart = await cartModel.findOne({ id: cartId })
        if (cart) {
            return cart.products
        } else {
            console.log('Cart not found')
            return null
        }
    }
}