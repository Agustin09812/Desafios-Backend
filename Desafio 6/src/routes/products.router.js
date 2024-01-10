import { Router } from 'express';
import ProductManagerDB from '../Dao/productManagerDB.js';

const productManager = new ProductManagerDB()

const productRouter = Router()

productRouter.get('/', async (req, res, next) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts(limit)
        res.json(products)
    } catch (error) {
        next(error)
    }
})

productRouter.get('/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid)
        const product = await productManager.getProductById(productId)
        res.json(product)
    } catch (error) {
        next(error)
    }
})

productRouter.post('/', async (req, res, next) => {
    try {
        const newProduct = req.body
        const addedProduct = await productManager.addProduct(newProduct)

        res.status(201).json({
            message: `New product added with id: ${addedProduct.id} inside "ecommerce\products" section`
        })
    } catch (error) {
        next(error)
    }
})

productRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const product = req.body
        await productManager.updateProduct(productId, product)
        res.json({ message: "Product updated successfully" })
    } catch (error) {
        console.log('error', err)
    }
})

productRouter.delete('/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid)
        await productManager.deleteProduct(productId)
        res.json({ message: "Product deleted successfully" })
    } catch (error) {
        next(error)
    }
})

export default productRouter