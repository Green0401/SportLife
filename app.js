const products = [
  {
    id: 1,
    category: "Camisetas deportivas",
    name: "Camiseta DryFit Pro",
    description: "Camiseta ligera y respirable ideal para entrenamiento.",
    price: 19990,
    image: "https://tse1.mm.bing.net/th/id/OIP.r-sHJQ-pSw7UvvJg1_qCJwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 2,
    category: "Pantalones deportivos",
    name: "Pantalón Flex Runner",
    description: "Pantalón cómodo y elástico para running o gimnasio.",
    price: 24990,
    image: "https://tse1.mm.bing.net/th/id/OIP.F-zFCZSeZ2btEOyT6W9QcwHaHa?r=0&w=1200&h=1200&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 3,
    category: "Accesorios",
    name: "Botella SportLife",
    description: "Botella reutilizable para mantener tu hidratación.",
    price: 9990,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
  }
];

// Elementos de la interfaz
const productsContainer = document.getElementById("products-container");
const cartContainer = document.getElementById("cart-container");
const cartTotal = document.getElementById("cart-total");

const checkoutForm = document.getElementById("checkout-form");
const confirmationSection = document.getElementById("confirmation-section");
const confirmationMessage = document.getElementById("confirmation-message");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const welcomeMessage = document.getElementById("welcome-message");

// =========================
// CARRITO Y SESSION STORAGE
// =========================
function getCart() {
  return JSON.parse(sessionStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

function renderProducts() {
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <p><strong>Categoría:</strong> ${product.category}</p>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>Precio:</strong> $${product.price.toLocaleString("es-CL")}</p>
      <button data-id="${product.id}">Agregar al carrito</button>
    `;

    productsContainer.appendChild(card);
  });

  const buttons = document.querySelectorAll(".product-card button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    const product = products.find((p) => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    cartTotal.textContent = "Total: $0";
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <p><strong>${item.name}</strong></p>
      <p>Precio: $${item.price.toLocaleString("es-CL")}</p>
      <p>Cantidad: ${item.quantity}</p>
      <p>Subtotal: $${(item.price * item.quantity).toLocaleString("es-CL")}</p>
    `;

    cartContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `Total: $${total.toLocaleString("es-CL")}`;
}

// =========================
// FORMULARIO Y CONFIRMACIÓN
// =========================
checkoutForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const cart = getCart();

  if (cart.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
    return;
  }

  if (fullName === "" || address === "" || email === "" || phone === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    alert("Ingresa un correo electrónico válido.");
    return;
  }

  const phoneRegex = /^[0-9]{8,15}$/;
  if (!phoneRegex.test(phone)) {
    alert("Ingresa un teléfono válido, solo con números y entre 8 y 15 dígitos.");
    return;
  }

  let total = 0;
  let orderDetails = "<ul>";

  cart.forEach((item) => {
    total += item.price * item.quantity;
    orderDetails += `
      <li>
        ${item.name} - Cantidad: ${item.quantity} - Subtotal: $${(item.price * item.quantity).toLocaleString("es-CL")}
      </li>
    `;
  });

  orderDetails += "</ul>";

  confirmationMessage.innerHTML = `
    <p><strong>Gracias por tu compra, ${fullName}.</strong></p>
    <p>Tu pedido será enviado a: ${address}</p>
    <p>Correo de contacto: ${email}</p>
    <p>Teléfono: ${phone}</p>
    <h3>Detalle del pedido</h3>
    ${orderDetails}
    <p><strong>Total pagado: $${total.toLocaleString("es-CL")}</strong></p>
  `;

  confirmationSection.style.display = "block";

  sessionStorage.removeItem("cart");
  renderCart();
  checkoutForm.reset();
});

// =========================
// AUTH0
// =========================
let auth0Client = null;

const auth0Config = {
  domain: "dev-pablo-green.us.auth0.com",
  clientId: "Qbd3XmWtKmv4ytw5Exk0i8FscIkkEvXE",
  authorizationParams: {
    redirect_uri: window.location.origin
  }
};

async function updateAuthUI() {
  if (!auth0Client) {
    welcomeMessage.textContent = "Auth0 no cargado";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";
    return;
  }

  try {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client.getUser();
      welcomeMessage.textContent = `Bienvenido, ${user.name || user.nickname || "usuario"}`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      welcomeMessage.textContent = "No has iniciado sesión";
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "inline-block";
    }
  } catch (error) {
    console.error("Error actualizando interfaz de Auth0:", error);
    welcomeMessage.textContent = "Error con Auth0";
  }
}

async function configureAuth0() {
  try {
    console.log("Iniciando configuración de Auth0...");

    if (!window.auth0) {
      throw new Error("El SDK de Auth0 no se cargó. Revisa index.html");
    }

    auth0Client = await window.auth0.createAuth0Client(auth0Config);
    console.log("Auth0 cargado correctamente");

    if (
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    ) {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    await updateAuthUI();
  } catch (error) {
    console.error("Error en configureAuth0:", error);
    welcomeMessage.textContent = "Error cargando Auth0";
  }
}

loginBtn.addEventListener("click", async () => {
  console.log("Se hizo clic en iniciar sesión");

  if (!auth0Client) {
    alert("Auth0 aún no se ha cargado correctamente.");
    return;
  }

  try {
    await auth0Client.loginWithRedirect();
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un error con Auth0. Revisa la consola.");
  }
});

logoutBtn.addEventListener("click", async () => {
  console.log("Se hizo clic en cerrar sesión");

  sessionStorage.removeItem("cart");
  renderCart();

  if (!auth0Client) {
    welcomeMessage.textContent = "No has iniciado sesión";
    return;
  }

  try {
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});

// =========================
// INICIO DE LA APP
// =========================
renderProducts();
renderCart();
configureAuth0();