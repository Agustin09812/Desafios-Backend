import express from 'express';
import handlebars from 'express-handlebars';
import fs from 'fs';
import { Server } from 'socket.io';
import CartManager from './cartManager.js';
import ProductManager from './productManager.js';

const app = express()
const port = 8080

const productManager = new ProductManager('productos.json')
const cartManager = new CartManager('carritos.json')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', 'src/views')
app.set('view engine', 'handlebars')

// index

app.get('/', async (req, res) => {
    let listado = await productManager.getProducts()
    res.render('home', { listado, title: 'Productos', style: 'home.css' })
})

// -------------------

// realTimeProducts

app.get('/realTimeProducts', async (req, res, next) => {
    try {
        const products = await productManager.getProducts()
        res.render('realTimeProducts', { products })
    } catch (error) {
        next(error)
    }
})

// -------------------

const httpServer = app.listen(port, async () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})

const socketServer = new Server(httpServer)

const products = await productManager.getProducts()

socketServer.on("connect", (socket) => {
    console.log("Nuevo cliente conectado")

    socketServer.emit("ProdLogs", products)
    socket.on("product", async (prod) => {
        await productManager.addProduct(prod)
    })

    socket.on("addProduct", async (prod) => {
        await productManager.addProduct(prod)
        // Emitir la lista actualizada de productos a todos los clientes
        socketServer.emit("updateProducts", await productManager.getProducts())
    })

    socket.on("deleteProduct", async (productId) => {
        await productManager.deleteProduct(productId)
        // Emitir la lista actualizada de productos a todos los clientes
        socketServer.emit("updateProducts", await productManager.getProducts())
    })

    socket.on("disconnect", () => {
        console.log("Cliente desconectado")
    })

})

// Rutas para productos
app.get('/products', async (req, res, next) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts(limit)
        res.json(products)
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid)
        const product = await productManager.getProductById(productId)
        res.json(product)
    } catch (error) {
        next(error)
    }
})

app.post('/products', async (req, res, next) => {
    try {
        const newProduct = req.body
        const addedProduct = await productManager.addProduct(newProduct)

        res.status(201).json({
            message: `New product added with id: ${addedProduct.id} inside: productos.json`
        })
    } catch (error) {
        next(error)
    }
})

app.put('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const product = req.body
        await productManager.updateProduct(productId, product)
        res.json({ message: "Product updated successfully" })
    } catch (error) {
        console.log('error', err)
    }
})

app.delete('/products/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid)
        await productManager.deleteProduct(productId)
        res.json({ message: "Product deleted successfully" })
    } catch (error) {
        next(error)
    }
})

// Rutas para carritos
app.post('/carts', async (req, res, next) => {
    try {
        const newCart = await cartManager.addCart(req.body)
        res.status(201).json({ message: `Cart with ID: ${newCart.id} successfully created in file carritos.json` })
    } catch (error) {
        next(error)
    }
})


app.get('/carts/:cid', async (req, res, next) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productsInCart = await cartManager.getProductsInCart(cartId)
        res.json(productsInCart)
    } catch (error) {
        next(error)
    }
})

app.post('/carts/:cid/product/:pid', async (req, res, next) => {
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