class ProductManager {
    constructor() {
        // Array vacio para almacenar los productos
      this.products = []
      // Contador para asignar IDs a los productos
      this.autoIncrementId = 1
    }
  
    // Método para agregar un producto al array vacio
    addProduct(title, description, price, thumbnail, code, stock) {
      // Validamos que todos los campos sean obligatorios
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios")
        return
      }
  
      // Validamos para que no se repita el campo "code"
      if (this.products.some(product => product.code === code)) {
        console.error("Ya existe un producto con el mismo código")
        return
      }
  
      const product = {
        id: this.autoIncrementId++, // Asignamos el ID para luego incrementar el contador
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      }
      
      // Agregamos el producto al arreglo de productos
      this.products.push(product)
      console.log("Producto agregado:", product)
    }
    
    // Método para obtener todos los productos
    getProducts() {
      return this.products
    }
    
    // Método para obtener un producto según su ID
    getProductById(id) {
        // Buscamos el producto en el arreglo por ID
      const product = this.products.find(product => product.id === id)

      // Mostramos el msj de error si el producto no se encuentra
      if (!product) {
        throw new Error("Producto no encontrado")
      }
      return product // Devolvemos el producto si se encontro
    }
  }
  
  const productManager = new ProductManager()
  
  // Agregamos dos productos de ejemplo
  // Para testear cambiar el ante último valor "code ..."
  productManager.addProduct("Producto 1", "Descripción 1", 10, "imagen1.jpg", "code 01", 50)
  productManager.addProduct("Producto 2", "Descripción 2", 20, "imagen2.jpg", "code 02", 30)
  
  console.log("Todos los productos:", productManager.getProducts())
  
  const productIdToFind = 1; // Cambiar este valor para testear el "not found"
  const foundProduct = productManager.getProductById(productIdToFind)
  console.log(`Producto con ID ${productIdToFind}:`, foundProduct)