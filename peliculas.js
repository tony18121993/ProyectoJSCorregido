// Variables
let pagina = 1;
let cargando = false;
let generos=[];

// funcion para hacer la llamada de la API para los generos 
// y cargalos en el select de generos
async function cargarGeneros() {
    let response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=57537ff19f381dd7b67eee1ea8b8164a');
    let data = await response.json();
    generos = data.genres;
  
    let selectGeneros = document.getElementById('filtrarPorGenero');
  
    generos.forEach(genero => {
      let opcion = document.createElement('option');
      opcion.value = genero.id;
      opcion.textContent = genero.name;
      selectGeneros.appendChild(opcion);

    });
  }


// funcion para cargar las peliculas de la API y luego mostralas
function cargarPeliculas() {
    if (cargando) {
        return;
    }

    // Mostrar el icono de carga
    mostrarIconoCarga();

    cargando = true;
    obtenerPeliculas()
        .then(mostrarPeliculas)
        .catch(error => {
            console.error('Error al cargar películas:', error);
        })
        .finally(() => {
            // Ocultar el icono de carga después de cargar las películas
            ocultarIconoCarga();

            cargando = false;
            pagina++;
            console.log(pagina);
        });
}

function mostrarIconoCarga() {
    // Mostrar el icono de carga
    let iconoCarga = document.getElementById('iconoCarga');
    if (iconoCarga) {
        iconoCarga.style.display = 'block';
    }
}

function ocultarIconoCarga() {
    // Ocultar el icono de carga
    let iconoCarga = document.getElementById('iconoCarga');
    if (iconoCarga) {
        iconoCarga.style.display = 'none';
    }
}


// llamada para obtener las peliculas
// y que cada vez cambie la pagina
async function obtenerPeliculas() {
    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?&page=${pagina}&api_key=57537ff19f381dd7b67eee1ea8b8164a`);
    return await response.json();
}


//   funcion para mostrar las peliculas en el contenedor
function mostrarPeliculas(peliculasAPI) {
    let contenedorPeliculas = document.getElementById('contenedor');
    peliculasAPI.results.forEach(pelicula => {
        let tarjeta = crearTarjetaPelicula(pelicula);
        contenedorPeliculas.appendChild(tarjeta);
    });
}

// funcion para crear y cargar las tarjetas de las peliculas
// y rellenarlas con los datos proporcionados por la API
function crearTarjetaPelicula(pelicula) {
    let tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');

    let imagenContainer = document.createElement('div');
    imagenContainer.classList.add('tarjeta_imagen');

    let titulo = document.createElement('h2');
    titulo.textContent = pelicula.title;

    let descripcion = document.createElement('p');
    descripcion.textContent = pelicula.overview;

    let imagen = document.createElement('img');
    imagen.src = `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`;
    imagen.alt = pelicula.title;

    imagenContainer.appendChild(imagen);

    let botonMostrar = document.createElement('button');
    botonMostrar.textContent = 'Mostrar Película';
    botonMostrar.classList.add('boton_detalle');
    botonMostrar.addEventListener('click', () => {
        mostrarDetallesPelicula(pelicula);
    });

    tarjeta.appendChild(imagenContainer);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(botonMostrar);

    return tarjeta;
}
// creamos una varieble para almacenar la pelicula mas tarde
let peliculaActual;
// funcion para mostrar el modal y cargar los datos de la pelicula en el 
function mostrarDetallesPelicula(pelicula) {
    peliculaActual = pelicula;

    // Verificar si la película ya está en el carrito
    let enCarrito = carrito.map(item => item.pelicula).includes(peliculaActual.title);

    let modal = document.getElementById('modal');
    let modalTitulo = document.getElementById('modal-titulo');
    let modalDescripcion = document.getElementById('modal-descripcion');
    let modalImagen = document.getElementById('modal-imagen');
    let modalMensajeCarrito = document.getElementById('modal-mensaje-carrito');

    modalTitulo.textContent = pelicula.title;
    modalDescripcion.textContent = pelicula.overview;
    modalImagen.src = `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`;

    // Ocultar/mostrar el mensaje según si la película está en el carrito o no
    modalMensajeCarrito.style.display = enCarrito ? 'block' : 'none';
    if (enCarrito) {
        modalMensajeCarrito.textContent = 'Esta película ya está añadida al carrito.';
    }

    modal.style.display = 'block';
}
// con la variable peliculaActual añadimos al carrito la pelicula
document.getElementById('boton-carrito').addEventListener('click', function() {
    anadirAlCarrito(peliculaActual.title);
});
// cierre del modal este lo llamamos desde el index pues porque si 
function cerrarModal() {
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
}


// llamada a la API para el filtrado
async function obtenerPeliculasGenero(genero,ordenar) {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?&page=1&sort_by=popularity.${ordenar}&with_genres=${genero}&api_key=57537ff19f381dd7b67eee1ea8b8164a`);
    return await response.json();
}

// carga de los datos de filtrado de la API
function cargarporGenero(genero,ordenar) {
    if (cargando) {
        return;
    }

    cargando = true;
    obtenerPeliculasGenero(genero,ordenar)
        .then(mostrarPeliculasFiltradas)
        .catch(error => {
            console.error('Error al cargar películas:', error);
        })
        .finally(() => {
            cargando = false;
            console.log(pagina);
        });
}

// funciones para el filtrado
function mostrarPeliculasFiltradas(peliculasAPI) {
    let contenedorPeliculas = document.getElementById('contenedor');
    contenedorPeliculas.innerHTML = "";
    peliculasAPI.results.forEach(pelicula => {
        let tarjeta = crearTarjetaPelicula(pelicula);
        contenedorPeliculas.appendChild(tarjeta);
    });
}

// funcion para vaciar el contenedor principal
function limpiarcontenedor(){
    let contenedorPeliculas = document.getElementById('contenedor');
    contenedorPeliculas.innerHTML = "";
}


// funcion del scroll
function scrollInfinito() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        cargarPeliculas();
    }
}
// llamada al scroll
window.addEventListener('scroll', scrollInfinito);

// funciones para la carga de la pagina de peliculas
window.onload = function() {
    if(!localStorage.getItem('usuario')){
        location.href="index.html";
    }else{
    cargarPeliculas();
    cargarGeneros();

    // Eventoi para el primer select (genero)
    document.getElementById('filtrarPorGenero').addEventListener('change', function() {
        let idGeneroSeleccionado = document.getElementById('filtrarPorGenero').value;
        let ordenar=document.getElementById('ordenar').value;

        if (idGeneroSeleccionado !== "") {
            cargarporGenero(idGeneroSeleccionado,ordenar);
        } else {
            limpiarcontenedor();
            pagina=1;
            cargarPeliculas();
        }
    });
    // Evento para el segundo select (ordenar)
document.getElementById('ordenar').addEventListener('change', function() {
    let idGeneroSeleccionado = document.getElementById('filtrarPorGenero').value;
    let ordenar = document.getElementById('ordenar').value;

    if (idGeneroSeleccionado !== "") {
        cargarporGenero(idGeneroSeleccionado, ordenar);
    } else {
        limpiarcontenedor();
        pagina = 1;
        cargarPeliculas();
    }
});
}
}


