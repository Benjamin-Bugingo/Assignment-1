// --- Update Cart Count ---
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = cartCount);
}

// --- Load Cart Items on Cart Page ---
function loadCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  if (!cartItemsContainer || !cartTotalElement) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>Quantity: ${item.quantity}</p>
          <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
      total += item.price * item.quantity;
    });
  }

  cartTotalElement.textContent = total.toFixed(2);
}

// --- Modal Setup ---
function setupModal() {
  const modal = document.getElementById("product-modal");
  const modalImg = document.getElementById("modal-img");
  const modalDesc = document.getElementById("modal-desc");

  if (modal && modalImg && modalDesc) {
    document.querySelectorAll(".product-card img").forEach(img => {
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalDesc.textContent = img.getAttribute("data-description") || img.alt;
      });
    });

    modal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
}

// --- Add to Cart Button Logic ---
function setupAddToCart() {
  document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const name = card.querySelector('h4').textContent.trim();
      const price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
      const image = card.querySelector('img').src;

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.name === name);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, image, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    });
  });
}

// --- Checkout Form Handling ---
function setupCheckoutForm() {
  const checkoutForm = document.getElementById('checkout-form');
  const confirmationMessage = document.getElementById('confirmation-message');

  if (checkoutForm && confirmationMessage) {
    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('full-name').value.trim();
      const address = document.getElementById('address').value.trim();
      const payment = document.getElementById('payment-method').value;

      if (!name || !address || !payment) {
        alert('Please complete all required fields.');
        return;
      }

      // Clear cart and update count
      localStorage.removeItem('cart');
      updateCartCount();

      // Show confirmation message
      confirmationMessage.innerHTML = `
        <h3>Thank you, ${name}!</h3>
        <p>Your order has been placed and will be delivered to:</p>
        <p><em>${address}</em></p>
        <p>Payment Method: ${payment}</p>
      `;
      confirmationMessage.style.display = 'block';
      checkoutForm.reset();

      // Redirect to home after delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 4000);
    });
  }
}

// --- Init on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadCartItems();
  setupModal();
  setupAddToCart();
  setupCheckoutForm();

  // Fallback if cart is empty
  const cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart || cart.length === 0) {
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = '0');
  }
});

// --- Handle browser cache on back/forward ---
window.addEventListener('pageshow', () => {
  updateCartCount();
  loadCartItems();
});
