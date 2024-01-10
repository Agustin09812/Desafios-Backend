const socket = io()

const productosDiv = document.getElementById('productos')

socket.on('updateProducts', (products) => {
    productosDiv.innerHTML = ''
    products.forEach(product => {
        productosDiv.innerHTML += `
        <hr>
        <div class="row">
    <div class="col">
        <strong>ID:</strong>
        <p>${product.id}</p>
    </div>
    <div class="col">
        <strong>Title:</strong>
        <p>${product.title}</p>
    </div>
    <div class="col">
        <strong>Description:</strong>
        <p>${product.description}</p>
    </div>
    <div class="col">
        <strong>Precio:</strong>
        <p>${product.price}</p>
    </div>
    <div class="col">
        <strong>Código:</strong>
        <p>${product.code}</p>
    </div>
    <div class="col">
        <strong>Stock:</strong>
        <p>${product.stock}</p>
    </div>
</div>`
    })
})