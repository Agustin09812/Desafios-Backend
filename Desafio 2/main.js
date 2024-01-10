const fs = require('fs')

class ProductManager {
  constructor(path) {
    this.path = path
    this.products = []
    this.autoIncrementId = 1

    // Leemos los productos del archivo al instanciar la clase
    this.loadProductsFromFile()
  }

  loadProductsFromFile() {
    try {
      // Intentamos leer el contenido del archivo y cargarlo en la propiedad 'products'
      const data = fs.readFileSync(this.path, 'utf8')
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

  saveProductsToFile() {
    console.log("Guardando productos en el archivo...")
    // Guardamos productos en el archivo en formato JSON con indentación de 2 espacios
    const data = JSON.stringify(this.products, null, 2)
    fs.writeFileSync(this.path, data, 'utf8')
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

  getProducts() {
    // Devolvemos todos los productos
    return this.products
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

  // Si se comenta esta parte del código, el producto se guarda en el archivo "productos.json", y no se elimina
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
  // ---------------------------------------------------------------------------------
}

// Pruebas
const productManager = new ProductManager('productos.json')

console.log("Todos los productos:", productManager.getProducts())

// Agregar más productos para testear funcionamiento del json

productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
})

productManager.addProduct({
  title: "producto de prueba 2",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc1234",
  stock: 25
})

productManager.addProduct({
  title: "producto de prueba 3",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc12345",
  stock: 25
})

// -----------------------------------------------------------------

console.log("Todos los productos:", productManager.getProducts())

const productIdToFind = 1
try {
  const foundProduct = productManager.getProductById(productIdToFind)
  console.log(`Producto con ID ${productIdToFind}:`, foundProduct)
} catch (error) {
  console.error(error.message)
}

const productIdToUpdate = 1
try {
  productManager.updateProduct(productIdToUpdate, { price: 250, stock: 30 })
} catch (error) {
  console.error(error.message)
}

const productIdToDelete = 1
try {
  productManager.deleteProduct(productIdToDelete)
} catch (error) {
  console.error(error.message)
}