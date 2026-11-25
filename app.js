const products = [
  { id: 1, name: "Arnés + Correa Marrón", color: "Marrón", price: 60000, image: "Imagenes/Collage de Dos Imágenes.png", illustration: "Imagenes/Pechera-marron.jpg", illustrationAlt: "Perro paseando con pechera y correa marrones", badge: "Más vendido" },
  { id: 2, name: "Arnés + Correa Azul", color: "Azul", price: 60000, image: "Imagenes/Collage de Dos Imágenes.azul.png", illustration: "Imagenes/pechera-azul.png", illustrationAlt: "Perro paseando con pechera y correa azules", badge: "Nuevo" },
  { id: 3, name: "Arnés + Correa Negro", color: "Negro", price: 60000, image: "Imagenes/cambio de color-negro.png", illustration: "Imagenes/persona_paseando_a_su_perro.jpg", illustrationAlt: "Persona paseando a su perro con un arnés negro", badge: "Premium" },
  {
    id: 4,
    name: "Cargador USB para Auto",
    details: "Universal 12V–24V · PD 30W",
    price: 25000,
    image: "Imagenes/cargador.png",
    gallery: [
      { src: "Imagenes/cargador.png", alt: "Cargador USB instalado en un vehículo" },
      { src: "Imagenes/cargador2.png", alt: "Cargador USB para vehículos de 12V a 24V" },
      { src: "Imagenes/cargador3.png", alt: "Cargador USB con puertos de carga rápida" }
    ],
    badge: "Nuevo"
  },
  {
    id: 5,
    name: "Bridas Organizadoras Individuales",
    details: "Adhesivas y reutilizables",
    price: 15000,
    variants: ["Blanco", "Gris", "Azul", "Rojo", "Amarillo", "Negro", "Púrpura", "Verde", "Mix"],
    image: "Imagenes/bridas1.jpg",
    gallery: [
      { src: "Imagenes/bridas1.jpg", alt: "Bridas organizadoras sujetando cables sobre una mesa" },
      { src: "Imagenes/bridas2.png", alt: "Instrucciones para fijar las bridas y ordenar cables" },
      { src: "Imagenes/bridas3.png", alt: "Bridas multicolores organizadas junto a cables" },
      { src: "Imagenes/bridas4.jpg", alt: "Empaque de bridas organizadoras multicolor" },
      { src: "Imagenes/bridas5.png", alt: "Instrucciones y usos de las bridas organizadoras" },
      { src: "Imagenes/bridas6.png", alt: "Juego de bridas multicolores" }
    ],
    badge: "Nuevo"
  }
];

const cart = [];
const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const heroCarousel = document.getElementById("heroCarousel");
const heroCarouselStatus = document.getElementById("heroCarouselStatus");
const heroEyebrow = document.getElementById("heroEyebrow");
const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const money = (value) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
const heroCopy = [
  {
    eyebrow: "Tecnología para el camino",
    title: "Carga rápida en cada viaje.",
    description: "Cargador para auto universal 12V–24V con carga PD de 30W."
  },
  {
    eyebrow: "Orden para tus espacios",
    title: "Cables organizados, espacios despejados.",
    description: "Bridas adhesivas multicolor para sujetar y ordenar tus cables."
  },
  {
    eyebrow: "Diseñado para aventuras reales",
    title: "Caminatas cómodas, paseos seguros.",
    description: "Arnés y correa marrones para acompañarte en cada paseo."
  }
];

function updateHeroCopy(index) {
  const copy = heroCopy[index];
  heroEyebrow.textContent = copy.eyebrow;
  heroTitle.textContent = copy.title;
  heroText.textContent = copy.description;
}

function renderProducts() {
  productGrid.innerHTML = products.map((product) => {
    const gallery = product.gallery || [
      { src: product.image, alt: product.name },
      ...(product.illustration ? [{ src: product.illustration, alt: product.illustrationAlt }] : [])
    ];
    const imageContent = gallery.length > 1
      ? `<div class="product-carousel" data-carousel-index="0">
          <div class="carousel-track">
            ${gallery.map((image) => `<img src="${image.src}" alt="${image.alt}" loading="lazy">`).join("")}
          </div>
          <button class="carousel-button carousel-previous" type="button" data-carousel-direction="-1" aria-label="Foto anterior">‹</button>
          <button class="carousel-button carousel-next" type="button" data-carousel-direction="1" aria-label="Foto siguiente">›</button>
        </div>`
      : `<img src="${gallery[0].src}" alt="${gallery[0].alt}" loading="lazy">`;
    const variantSelector = product.variants
      ? `<div class="product-variant">
          <label for="product-variant-${product.id}">Color</label>
          <select id="product-variant-${product.id}" data-product-variant="${product.id}" required>
            <option value="" selected disabled>Elegí un color</option>
            ${product.variants.map((variant) => `<option value="${variant}">${variant}</option>`).join("")}
          </select>
        </div>`
      : "";
    const quantityControl = `
      <div class="quantity-control">
        <label for="product-quantity-${product.id}">Cantidad</label>
        <div class="quantity-stepper">
          <button type="button" data-quantity-change="-1" aria-label="Reducir cantidad de ${product.name}">−</button>
          <input id="product-quantity-${product.id}" type="number" min="1" step="1" value="1" inputmode="numeric" data-product-quantity="${product.id}">
          <button type="button" data-quantity-change="1" aria-label="Aumentar cantidad de ${product.name}">+</button>
        </div>
      </div>`;

    return `
      <article class="product-card product-card-${product.id}">
        <div class="product-image">
          <span class="product-badge">${product.badge}</span>
          ${imageContent}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.details || `Color ${product.color} · Kit completo`}</p>
          <strong class="product-price">${money(product.price)}</strong>
          ${variantSelector}
          ${quantityControl}
          <button class="add-button" type="button" data-product-id="${product.id}"${product.variants ? " disabled" : ""}>Agregar al carrito</button>
        </div>
      </article>
    `;
  }).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}

function renderCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = money(total);

  cartItems.innerHTML = cart.length
    ? cart.map((item, index) => `
        <article class="cart-item">
          <img src="${item.image}" alt="">
          <div><h3>${item.variant ? `${item.name} (${item.variant})` : item.name}</h3><p>${item.quantity} × ${money(item.price)}</p></div>
          <button class="remove-item" type="button" data-cart-index="${index}" aria-label="Eliminar ${item.name}${item.variant ? ` ${item.variant}` : ""}">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"></path>
            </svg>
          </button>
        </article>
      `).join("")
    : '<p class="empty-cart">Tu carrito está vacío.</p>';

  const message = cart.length
    ? `Hola, quiero comprar:\n${cart.map((item) => `- ${item.quantity} x ${item.name}${item.variant ? ` (${item.variant})` : ""} (${money(item.price)} c/u)`).join("\n")}\nTotal: ${money(total)}`
    : "Hola, quiero consultar por los accesorios.";
  checkoutButton.href = `https://wa.me/541140346789?text=${encodeURIComponent(message)}`;
}

productGrid.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity-change]");
  if (quantityButton) {
    const quantityInput = quantityButton.closest(".quantity-stepper").querySelector("[data-product-quantity]");
    const currentQuantity = Number(quantityInput.value);
    const change = Number(quantityButton.dataset.quantityChange);
    quantityInput.value = String(Math.max(1, (Number.isSafeInteger(currentQuantity) ? currentQuantity : 1) + change));
    quantityInput.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  const carouselButton = event.target.closest("[data-carousel-direction]");
  if (carouselButton) {
    const carousel = carouselButton.closest(".product-carousel");
    const slides = carousel.querySelectorAll(".carousel-track img");
    const currentIndex = Number(carousel.dataset.carouselIndex);
    const direction = Number(carouselButton.dataset.carouselDirection);
    const nextIndex = (currentIndex + direction + slides.length) % slides.length;
    carousel.dataset.carouselIndex = nextIndex;
    carousel.querySelector(".carousel-track").style.transform = `translateX(-${nextIndex * 100}%)`;
    return;
  }

  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  const product = products.find((item) => item.id === Number(button.dataset.productId));
  const quantityInput = productGrid.querySelector(`[data-product-quantity="${product.id}"]`);
  const variantSelector = productGrid.querySelector(`[data-product-variant="${product.id}"]`);
  cart.push({
    ...product,
    quantity: Number(quantityInput.value),
    ...(variantSelector ? { variant: variantSelector.value } : {})
  });
  renderCart();
  openCart();
});

function updateAddButton(control) {
  const productInfo = control.closest(".product-info");
  const quantityInput = productInfo.querySelector("[data-product-quantity]");
  const variantSelector = productInfo.querySelector("[data-product-variant]");
  const quantity = Number(quantityInput.value);
  const hasValidQuantity = Number.isSafeInteger(quantity) && quantity >= 1;
  const hasRequiredVariant = !variantSelector || Boolean(variantSelector.value);
  productInfo.querySelector("[data-product-id]").disabled = !hasValidQuantity || !hasRequiredVariant;
}

productGrid.addEventListener("input", (event) => {
  const quantityInput = event.target.closest("[data-product-quantity]");
  if (quantityInput) updateAddButton(quantityInput);
});

productGrid.addEventListener("change", (event) => {
  const variantSelector = event.target.closest("[data-product-variant]");
  if (variantSelector) updateAddButton(variantSelector);
  const quantityInput = event.target.closest("[data-product-quantity]");
  if (quantityInput) updateAddButton(quantityInput);
});

heroCarousel.addEventListener("click", (event) => {
  const button = event.target.closest("[data-feature-direction]");
  if (!button) return;

  const slides = heroCarousel.querySelectorAll(".hero-feature");
  const currentIndex = Number(heroCarousel.dataset.carouselIndex);
  const direction = Number(button.dataset.featureDirection);
  const nextIndex = (currentIndex + direction + slides.length) % slides.length;
  heroCarousel.dataset.carouselIndex = nextIndex;
  heroCarousel.querySelector(".hero-carousel-track").style.transform = `translateX(-${nextIndex * 100}%)`;
  heroCarouselStatus.textContent = `${nextIndex + 1} / ${slides.length}`;
  updateHeroCopy(nextIndex);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-index]");
  if (!button) return;
  cart.splice(Number(button.dataset.cartIndex), 1);
  renderCart();
});

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderProducts();
renderCart();
updateHeroCopy(Number(heroCarousel.dataset.carouselIndex));

const pageEndMarker = document.getElementById("pageEndMarker");
const backToTop = document.querySelector(".back-to-top");
const pageEndObserver = new IntersectionObserver(([entry]) => {
  backToTop.hidden = !entry.isIntersecting;
});
pageEndObserver.observe(pageEndMarker);
