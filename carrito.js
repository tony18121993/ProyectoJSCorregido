let carrito=[];

// comprobar que existe la variable local carrito y guardarla en carrito

if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
}

// funcion de añadir al carrito de localStorage
function anadirAlCarrito(pelicula) {
    let index = carrito.findIndex(item => item.pelicula === pelicula);
    console.log(pelicula);
    console.log(index)
    if (index !== -1) {
        carrito[index].cantidad++;
    } else {
        carrito.push({
            pelicula: pelicula,
            cantidad: 1,
            precio: 2.99
        });
    }
     localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Pelicula añadida al carrito');
}

// funcionalidades para mostrar la tabla del carrito y que aumente o disminuya o elimine
function mostrarTablaCarrito() {
    let contenedorPeliculas = document.getElementById('contenedor');
    contenedorPeliculas.innerHTML = "";
    let tabla = document.getElementById('carrito_Tabla');
    tabla.style.display='block';
    let tbody = tabla.querySelector('tbody');

    tbody.innerHTML = '';

    carrito.forEach((item,index) => {
        let fila = document.createElement('tr');
        let nombreCell = document.createElement('td');
        let cantidadCell = document.createElement('td');
        let precioCell = document.createElement('td');
        let opcionesCell = document.createElement('td');

        nombreCell.textContent = item.pelicula;
        cantidadCell.textContent = item.cantidad;
        precioCell.textContent = `${(item.cantidad * item.precio).toFixed(2)}€`;
        
        let botonAumentar = document.createElement('button');
        botonAumentar.textContent = '+';
        botonAumentar.addEventListener('click', () => aumentarCantidad(index));

        let botonDisminuir = document.createElement('button');
        botonDisminuir.textContent = '-';
        botonDisminuir.addEventListener('click', () => disminuirCantidad(index));

        let botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => eliminarArticulo(index));

        opcionesCell.appendChild(botonAumentar);
        opcionesCell.appendChild(botonDisminuir);
        opcionesCell.appendChild(botonEliminar);

        nombreCell.textContent = item.pelicula;
        cantidadCell.textContent = item.cantidad;
        precioCell.textContent = `${(item.cantidad * item.precio).toFixed(2)}€`;

        

        fila.appendChild(nombreCell);
        fila.appendChild(cantidadCell);
        fila.appendChild(precioCell);
        fila.appendChild(opcionesCell);
        tbody.appendChild(fila);
    });
    let precioTotalParrafo = document.createElement('p');
    precioTotalParrafo.textContent = `El precio total de su carrito es: ${calcularPrecioTotal().toFixed(2)}€`;
    contenedorPeliculas.appendChild(precioTotalParrafo);
    let realizarPedidoBtn = document.getElementById('realizarPedido');
    realizarPedidoBtn.style.display = carrito.length > 0 ? 'block' : 'none';
}

document.querySelector('.cart-icon').addEventListener('click', mostrarTablaCarrito);

function calcularPrecioTotal() {
    return carrito.reduce((total, item) => total + (item.cantidad * item.precio), 0);
}

function aumentarCantidad(index) {
    carrito[index].cantidad++;
    actualizarCarrito();
}

function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    actualizarCarrito();
}

function eliminarArticulo(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarTablaCarrito();
}

// vamos a cerrar la sesion y vaciar el carrito avisando al cliente
document.getElementById('sesion-out').addEventListener('click',()=>{
    let confirmacion = confirm('¿Estás seguro de cerrar la sesión y vaciar el carrito?');
    
    if (confirmacion) {
        carrito = [];
        localStorage.removeItem('usuario');
        localStorage.removeItem('carrito');
        window.location.href = 'index.html';
    }
});

// al pulsar el boton realizar pedido enviamos un email con el precio total del pedido
emailjs.init("TPeAAz9eS6NeNHYgn");

document.getElementById('realizarPedido').addEventListener('click', function () {
    let correoUsuario = prompt("Por favor, introduce tu correo electrónico:");
    
    if (correoUsuario) {
        let precioFinal = carrito.reduce((total, item) => total + (item.cantidad * item.precio), 0);
        enviarCorreo(correoUsuario, precioFinal);
        alert(`Se le ha enviado un correo con el precio de su pedido`);
    } else {
        alert("Debes ingresar un correo electrónico para completar la orden.");
    }
});



function enviarCorreo(correoUsuario, precioFinal) {
    let parametros = {
        to_email: correoUsuario,
        from_name: "VideoClub Antonio",
        message: `${precioFinal.toFixed(2)}€`,
    };

    emailjs.send("service_pp7gitf", "template_7i1ujdl", parametros)
        .then(function(response) {
            console.log("Correo electrónico enviado con éxito:", response);
        }, function(error) {
            console.error("Error al enviar el correo electrónico:", error);
        });
}