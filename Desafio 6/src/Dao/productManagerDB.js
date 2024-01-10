import { productModel } from "./Models/product.model.js"

export default class ProductManagerDB {
    constructor() {
    }


    async addProduct(product) {
        return await productModel.create(product)
    }

    async getProducts() {
        const productos = await productModel.find()
        return productos
    }

    async getProductById(id) {
        const product = await productModel.findOne({ id: id })
        if (product) {
            return product
        } else {
            console.log('Id doesnt exist')
        }
    }

    async updateProduct(id, newProduct) {
        const product = await productModel.findOneAndUpdate({ id: id }, newProduct)
        return product
    }

    async deleteProduct(id) {
        const product = await productModel.findOneAndDelete({ id: id })
        return product
    }

}