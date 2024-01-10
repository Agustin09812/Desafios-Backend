const express = require('express')
const fs = require('fs/promises')

class ProductManager {
  constructor(path) {
    this.path = path
    this.products = []
    this.autoIncrementId = 1

    // Leemos los productos del archivo al instanciar la clase
    this.loadProductsFromFile()
  }

  async loadProductsFromFile() {
    try {
      // Intentamos leer el contenido del archivo y cargarlo en la propiedad 'products'
      const data = await fs.readFile(this.path, 'utf8')
      this.products = JSON.parse(data)
      // Actualizamos el autoIncrementId en función del máximo id actual en los productos
      this.updateAutoIncrementId()
    } catch (error) {
      // Si hay un error al leer el archivo (puede ser que no exista), mostramos el error
      console.error("Error al cargar productos desde el archivo:", error.message)
      // Inicializamos 'products' con un array vacío
      this.products = []
    }
  }

  updateAutoIncrementId() {
    const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0)
    this.autoIncrementId = maxId + 1
  }

  async saveProductsToFile() {
    console.log("Guardando productos en el archivo...")
    // Guardamos productos en el archivo en formato JSON con indentación de 2 espacios
    const data = JSON.stringify(this.products, null, 2)
    await fs.writeFile(this.path, data, 'utf8')
    console.log("Productos guardados con éxito.")
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error("Todos los campos son obligatorios")
      return
    }

    if (this.products.some(existingProduct => existingProduct.code === product.code)) {
      console.error("Ya existe un producto con el mismo código")
      return
    }

    // Creamos un nuevo producto con un id autoincremental y lo agregamos al array de productos
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
    this.saveProductsToFile()
    console.log("Producto agregado:", newProduct)
  }

  getProducts(limit) {
    // Devolvemos todos los productos o solo los primeros "limit" productos si se proporciona
    return limit ? this.products.slice(0, limit) : this.products
  }

  getProductById(id) {
    // Buscamos un producto por su id
    const product = this.products.find(existingProduct => existingProduct.id === id)

    // Si no se encuentra el producto, mostramos un error
    if (!product) {
      throw new Error("Producto no encontrado")
    }

    return product
  }

  updateProduct(id, updatedFields) {
    // Buscamos el índice del producto que coincide con el id proporcionado
    const index = this.products.findIndex(product => product.id === id)

    // Si no se encuentra el producto, mostramos un error
    if (index === -1) {
      throw new Error("Producto no encontrado")
    }

    // Actualizamos los campos del producto sin borrar el id y guardamos los cambios en el archivo
    this.products[index] = {
      ...this.products[index],
      ...updatedFields,
      id, // No debe borrarse el id
    }

    this.saveProductsToFile()
    console.log("Producto actualizado:", this.products[index])
  }

  deleteProduct(id) {
    // Buscamos el índice del producto que coincide con el id proporcionado
    const index = this.products.findIndex(product => product.id === id)

    // Si no se encuentra el producto, mostramos un error
    if (index === -1) {
      throw new Error("Producto no encontrado")
    }

    // Eliminamos el producto del array y guardamos los cambios en el archivo
    const deletedProduct = this.products.splice(index, 1)[0]
    this.saveProductsToFile()
    console.log("Producto eliminado:", deletedProduct)
  }
}

const app = express()
const port = 8080

const productManager = new ProductManager('productos.json')

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error interno del servidor')
})

// ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor Express!')
})

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

app.listen(port, async () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`)
})


// comando para levantar el servidor:
// node '.\Desafio 3\app.js'
