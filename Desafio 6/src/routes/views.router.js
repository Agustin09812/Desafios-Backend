import { Router } from 'express';
import ProductManager from '../Dao/productManager.js';

const productManager = new ProductManager()

const viewsRouter = Router()

viewsRouter.get('/', async (req, res) => {
    try {
        res.render('chat', { title: 'Chat' })
    } catch (error) {
        console.error("Error getting products:", error.message)
        res.status(500).send("Internal Server Error")
    }
})

viewsRouter.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts()

        res.render('home', { products })
    } catch (error) {
        console.error("Error getting products:", error.message)
        res.status(500).send("Internal Server Error")
    }
})

viewsRouter.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await productManager.getProducts()

        res.render('realTimeProducts', { products })
    } catch (error) {
        console.error("Error getting products:", error.message)
        res.status(500).send("Internal Server Error")
    }
})

export default viewsRouter