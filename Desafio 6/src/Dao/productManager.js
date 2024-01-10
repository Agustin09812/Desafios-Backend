import { productModel } from "./Models/product.model.js";

export default class ProductManager {
    async addProduct(product) {
        try {
            const newProduct = await productModel.create(product);
            console.log("Product added:", newProduct);
            return newProduct;
        } catch (error) {
            console.error("Error adding product:", error.message);
            throw error;
        }
    }

    async getProducts(limit) {
        try {
            const products = await productModel.find();
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            console.error("Error getting products:", error.message);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findOne({ id: id });
            if (!product) {
                throw new Error("Product not found");
            }
            return product;
        } catch (error) {
            console.error("Error getting product by ID:", error.message);
            throw error;
        }
    }

    async updateProduct(id, newProduct) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, newProduct, { new: true });
            if (!updatedProduct) {
                throw new Error("Product not found");
            }
            console.log("Product updated:", updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.error("Error updating product:", error.message);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error("Product not found");
            }
            console.log("Product deleted:", deletedProduct);
            return deletedProduct;
        } catch (error) {
            console.error("Error deleting product:", error.message);
            throw error;
        }
    }
}

