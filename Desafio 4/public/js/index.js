const socket = io()

const title = document.getElementById("title")
const description = document.getElementById("description")
const price = document.getElementById("price")
const code = document.getElementById("code")
const stock = document.getElementById("stock")

// realTimeProducts
const form = document.getElementById('productForm');
const productosDiv = document.getElementById('productos');

const productData = document.getElementById("productos")

// Escuchar eventos 'updateProducts' desde el servidor
socket.on('updateProducts', (products) => {
    // Limpiamos el contenido actual y mostramos la nueva lista de productos
    productosDiv.innerHTML = '';
    products.forEach(product => {
        productosDiv.innerHTML += `<p>${product.title} - ${product.description} - ${product.price} - ${product.code} - ${product.stock} <button onclick="deleteProduct('${product._id}')">Eliminar</button></p>`;
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault()

    // Obtener valores del formulario
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const code = document.getElementById('code').value
    const stock = document.getElementById('stock').value

    // Enviar un evento 'addProduct' al servidor
    socket.emit('addProduct', { title, description, price, code, stock })
})

// Función para eliminar un producto
function deleteProduct(productId) {
    // Enviar un evento 'deleteProduct' al servidor
    socket.emit('deleteProduct', productId)
}