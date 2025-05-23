// ID de tu Google Sheets (ejemplo: "1XqOt7kiE1gWJkQj9...")
const SPREADSHEET_ID = "1q5b3g5mXMNX2wd-RuJpbSLuuJilEP57AExHBUGD-LDU";
const API_KEY = "AIzaSyD5fPLSX_lfuT2szg6nTWiN1qRrBIqkHj4"; // Obtén una en: https://developers.google.com/sheets/api

// Cargar productos desde Google Sheets
async function cargarProductos() {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Productos!A2:E?key=${API_KEY}`
  );
  const data = await response.json();
  return data.values.map(row => ({
    nombre: row[0],
    categoria: row[1],
    precio: row[2],
    stock: row[3],
  }));
}

// Mostrar productos en HTML (con imágenes WEBP automáticas)
function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  // Filtrar productos con stock > 0 y generar ruta de imagen
  const productosConStock = productos
    .filter(producto => producto.stock > 0)
    .map(producto => ({
      ...producto,
      // Genera la ruta de la imagen: "nombre-del-producto.webp" (en minúsculas y sin espacios)
      imagen: `${producto.nombre.toLowerCase().replace(/\s+/g, '-')}.webp`
    }));

  productosConStock.forEach(producto => {
    const divProducto = document.createElement("div");
    divProducto.className = "producto";
    divProducto.dataset.categoria = producto.categoria;

    divProducto.innerHTML = `
      <img src="images/${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/default.webp'">
      <div class="producto-info">
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        <p>Stock: ${producto.stock} unidades</p>
      </div>
    `;

    contenedor.appendChild(divProducto);
  });
}

// Filtrado por categoría
document.querySelectorAll(".btn-filtro").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const categoria = btn.dataset.categoria;
    const productos = document.querySelectorAll(".producto");

    productos.forEach(producto => {
      if (categoria === "todo" || producto.dataset.categoria === categoria) {
        producto.style.display = "block";
      } else {
        producto.style.display = "none";
      }
    });
  });
});

// Inicializar
document.addEventListener("DOMContentLoaded", async () => {
  const productos = await cargarProductos();
  mostrarProductos(productos);
});