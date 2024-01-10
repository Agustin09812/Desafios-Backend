const socket = io()

let userData

Swal.fire({
    title: "¡Hola! Ingrese su nombre y apellido",
    html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre">
        <input id="swal-input2" class="swal2-input" placeholder="Apellido">
    `,
    inputAttributes: {
        autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
        const nombre = Swal.getPopup().querySelector('#swal-input1').value
        const apellido = Swal.getPopup().querySelector('#swal-input2').value

        const nombreValido = (nombre) => {
            return nombre.trim() !== '' && !isNaN(nombre)
        }

        const apellidoValido = (apellido) => {
            return apellido.trim() !== '' && !isNaN(apellido)
        }

        if (!nombreValido || !apellidoValido) {
            Swal.showValidationMessage('Debes ingresar un nombre y un apellido válidos')
        }

        return { nombre, apellido }
    }
}).then((result) => {
    if (result.isConfirmed) {
        userData = result.value

        Swal.fire({
            title: `Bienvenido, ${userData.nombre} ${userData.apellido}!`,
            icon: 'success',
            toast: true,
            position: 'top-right'
        })

        socket.emit('newUser', userData)
    }
})

const inputData = document.getElementById('inputData')
const outputData = document.getElementById('outputData')

inputData.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (!!inputData.value.trim()) {
            socket.emit('message', {
                user: `${userData.nombre} ${userData.apellido}`,
                message: inputData.value,
            })
        }
        inputData.value = ""
    }
})

socket.on('messageLogs', data => {
    let messages = ""
    data.forEach(message => {
        messages += `<strong>${message.user}</strong><br /> ${message.message} <br />`
    })
    outputData.innerHTML = messages
    outputData.scrollTop = outputData.scrollHeight
})

socket.on('newConnection', data => {
    console.log(data)
})

socket.on('notification', user => {
    Swal.fire({
        text: `${user.nombre} ${user.apellido} se ha conectado`,
        toast: true,
        position: 'top-right'
    })
})
