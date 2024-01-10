import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { messageModel } from "./Dao/Models/message.model.js";
import { productModel } from "./Dao/Models/product.model.js";
import ProductManager from './Dao/productManager.js';
import cartRouter from "./routes/carts.router.js";
import productRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";

const productManager = new ProductManager()

const app = express()
const port = 8080

// express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", "src/views")
app.set("view engine", "handlebars")

// routes
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", viewsRouter)

// mongoose
mongoose.connect('mongodb+srv://agustinlago:agustin2024@ecommerce.61fk5gx.mongodb.net/ecommerce')

const httpServer = app.listen(port, async () => {
    console.log(`Server listening on http://localhost:${port}`)
})

const io = new Server(httpServer)

io.on('connect', async (socket) => {
    console.log("New client connected")

    try {
        const products = await productModel.find()
        io.to(socket.id).emit('updateProducts', products)
    } catch (error) {
        console.error('Error fetching products:', error.message)
    }

    socket.on('message', async (data) => {
        try {
            await messageModel.create(data)
            io.emit('messageLogs', await messageModel.find())
        } catch (error) {
            console.error('Error handling message:', error.message)
        }
    })

    socket.on('newUser', (user) => {
        io.emit('newConnection', `A new user has connected: ${user.nombre} ${user.apellido}`)
        socket.broadcast.emit('notification', user)
    })

    socket.on('product', async (prod) => {
        try {
            await productModel.create(prod)
            io.emit('updateProducts', await productManager.getProducts())
        } catch (error) {
            console.error('Error adding product:', error.message)
        }
    })

    socket.on("addProduct", async (product) => {
        try {
            await productManager.addProduct(product)
            io.emit("updateProducts", await productManager.getProducts())
        } catch (error) {
            console.error('Error adding product and updating list:', error.message)
        }
    })

    socket.on('deleteProduct', async (id) => {
        try {
            await productModel.findOneAndDelete({ id: id })
            io.emit('updateProducts', await productManager.getProducts())
        } catch (error) {
            console.error('Error deleting product and updating list:', error.message)
        }
    })

    socket.on('disconnect', () => {
        console.log("Client disconnected")
    })
})