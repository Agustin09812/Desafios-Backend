import { Router } from 'express';
import CartManagerDB from "../Dao/cartManagerDB.js";
import ProductManager from "../Dao/productManager.js";

const cartManager = new CartManagerDB()
const productManager = new ProductManager()

const cartRouter = Router()

cartRouter.post('/', async (req, res, next) => {
    try {
        const newCart = await cartManager.addCart(req.body)
        res.status(201).json({ message: `Cart with ID: ${newCart.id} successfully created in ATLAS on "ecommerce" collection under "carts" value.` })
    } catch (error) {
        next(error)
    }
})


cartRouter.get('/:cid', async (req, res, next) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productsInCart = await cartManager.getProductsInCart(cartId)
        res.json(productsInCart)
    } catch (error) {
        next(error)
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res, next) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        const quantity = req.body.quantity !== undefined ? req.body.quantity : 1

        // Obtener la información del producto por ID
        const product = await productManager.getProductById(productId)

        // Agregar el producto al carrito
        await cartManager.addProductToCart(cartId, productId, quantity)

        // Construir el mensaje con el título del producto
        const message = `Product added to cart: ${cartId}, ${product.title}, quantity: ${quantity}`

        res.json({ message })
    } catch (error) {
        next(error)
    }
})

export default cartRouter