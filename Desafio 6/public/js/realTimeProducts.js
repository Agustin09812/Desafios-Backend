const socket = io()

const id = document.getElementById("id")
const title = document.getElementById("title")
const description = document.getElementById("description")
const price = document.getElementById("price")
const code = document.getElementById("code")
const stock = document.getElementById("stock")
const form = document.getElementById('productForm')
const productosDiv = document.getElementById('productos')

socket.on('updateProducts', (products) => {
    productosDiv.innerHTML = ''
    products.forEach(product => {
        productosDiv.innerHTML += `
        <hr>
        <div class="list-group-item">
            <div class="d-flex justify-content-between">
                <div>
                    <h6 class="mb-1">Id: ${product.id}</h6>
                    <h5 class="mb-1">${product.title}</h5>
                    <p class="mb-1">${product.description}</p>
                    <p class="mb-1">Precio: ${product.price}</p>
                    <p class="mb-1">Código: ${product.code}</p>
                    <p class="mb-1">Stock: ${product.stock}</p>
                </div>
                <button type="button" class="btn btn-danger btn-sm h-25 d-flex" onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        </div>`
    })
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    // valores del formulario
    const id = document.getElementById("id").value
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const code = document.getElementById('code').value
    const stock = document.getElementById('stock').value

    socket.emit('addProduct', { id, title, description, price, code, stock })
})

// eliminar un producto
function deleteProduct(productId) {
    socket.emit('deleteProduct', productId)
}