import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path
        this.products = []
        this.autoIncrementId = 1

        this.loadProductsFromFile().then(() => {
            this.updateAutoIncrementId()
        })
    }

    async loadProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8')
            this.products = JSON.parse(data)
            this.updateAutoIncrementId()
        } catch (error) {
            console.error("Error loading products from file:", error.message)
            this.products = []
        }
    }

    async updateAutoIncrementId() {
        const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0)
        this.autoIncrementId = maxId + 1
    }

    async addProduct(product) {
        // || !product.thumbnail || !product.code
        if (!product.title || !product.description || !product.price || !product.stock) {
            console.error("All fields are required")
            return
        }

        const newProduct = {
            id: this.autoIncrementId++,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
        }

        this.products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8')
        console.log("Product added:", newProduct)

        return newProduct
    }

    async getProducts(limit) {
        return limit ? this.products.slice(0, limit) : this.products
    }

    async getProductById(id) {
        const product = this.products.find(existingProduct => existingProduct.id === id)
        if (!product) {
            throw new Error("Product not found")
        }

        return product
    }

    async updateProduct(id, newProduct) {
        try {
            const products = await this.getProducts()
            const product = products.find((product) => product.id === Number(id))

            if (newProduct.title) product.title = newProduct.title
            if (newProduct.description) product.description = newProduct.description
            if (newProduct.price) product.price = newProduct.price
            if (newProduct.thumbnail) product.thumbnail = newProduct.thumbnail
            if (newProduct.code) product.code = newProduct.code
            if (newProduct.stock) product.stock = newProduct.stock

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8')

            console.log("Product update:", product)
        } catch (error) {
            console.error(error.message)
            throw error
        }
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id)
        if (index === -1) {
            throw new Error("Product not found")
        }
        const deletedProduct = this.products.splice(index, 1)[0]
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8')
        console.log("Product deleted:", deletedProduct)
    }
}