// Importamos el CSS. Vite permite importar estilos desde JavaScript.
import './style.css'

// ─────────────────────────────────────────────
// CONCEPTO 1: Pintar el HTML desde JavaScript
// Tomamos el <div id="app"> del index.html y le metemos
// el formulario usando un template literal (comillas invertidas ` `).
// ─────────────────────────────────────────────
document.querySelector('#app').innerHTML = `
  <main class="contenedor">
    <h1>🛒 Lista de Mercado</h1>

    <form id="formulario">
      <input type="text" id="producto" placeholder="Ej: Tortillas" required />
      <input type="number" id="cantidad" min="1" value="1" />
      <button type="submit">Agregar</button>
    </form>

    <ul id="lista"></ul>

    <p id="total">Productos: 0</p>
  </main>
`

// ─────────────────────────────────────────────
// CONCEPTO 2: Seleccionar elementos del DOM
// OJO: esto va DESPUÉS del innerHTML, porque antes
// esos elementos todavía no existen en la página.
// ─────────────────────────────────────────────
const formulario = document.querySelector('#formulario')
const inputProducto = document.querySelector('#producto')
const inputCantidad = document.querySelector('#cantidad')
const lista = document.querySelector('#lista')
const total = document.querySelector('#total')

// ─────────────────────────────────────────────
// CONCEPTO 3: El "estado" de la app
// Los datos viven en un arreglo de objetos.
// La pantalla siempre se dibuja a partir de este arreglo.
// ─────────────────────────────────────────────
let productos = []

// ─────────────────────────────────────────────
// CONCEPTO 4: Funciones
// render() limpia la lista y la vuelve a dibujar con los datos actuales.
// ─────────────────────────────────────────────
function render() {
  lista.innerHTML = '' // limpiamos lo que había

  // CONCEPTO 5: Recorrer un arreglo con forEach
  productos.forEach((item, indice) => {
    // CONCEPTO 6: Crear elementos HTML desde JS
    const li = document.createElement('li')

    const texto = document.createElement('span')
    texto.textContent = `${item.cantidad} x ${item.nombre}`

    const botonEliminar = document.createElement('button')
    botonEliminar.textContent = '❌'
    botonEliminar.addEventListener('click', () => eliminarProducto(indice))

    li.append(texto, botonEliminar)
    lista.appendChild(li)
  })

  total.textContent = `Productos: ${productos.length}`
}

function agregarProducto(nombre, cantidad) {
  productos.push({ nombre, cantidad }) // agregamos un objeto al arreglo
  render()
}

function eliminarProducto(indice) {
  // filter crea un arreglo nuevo SIN el elemento de ese índice
  productos = productos.filter((_, i) => i !== indice)
  render()
}

// ─────────────────────────────────────────────
// CONCEPTO 7: Eventos
// Escuchamos cuando el formulario se envía.
// ─────────────────────────────────────────────
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault() // evita que la página se recargue

  const nombre = inputProducto.value.trim() // .trim() quita espacios
  const cantidad = Number(inputCantidad.value) // texto → número

  // CONCEPTO 8: Validación con condicionales
  if (nombre === '') {
    alert('Escribe un producto')
    return
  }

  agregarProducto(nombre, cantidad)

  formulario.reset()
  inputProducto.focus()
})

render()
