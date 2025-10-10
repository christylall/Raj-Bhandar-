document.addEventListener("DOMContentLoaded", function () {
  const cart = {};
  const cartUI = document.getElementById("cart-container");
  const cartToggle = document.getElementById("cart-toggle");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsList = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeModal = document.getElementById("closeModal");
  const orderSummary = document.getElementById("order-summary");
  const orderTotal = document.getElementById("order-total");
  const placeOrderBtn = document.getElementById("place-order");
  const successContainer = document.getElementById("success-container");

  function renderCart() {
    cartItemsList.innerHTML = "";
    let total = 0, count = 0;

    for (let itemName in cart) {
      const item = cart[itemName];
      total += item.price * item.qty;
      count += item.qty;

      const li = document.createElement("li");
      li.innerHTML = `
        <div class="cart-details">
          <strong>${itemName}</strong>
          <span>₹${item.price} x ${item.qty}</span>
        </div>
        <div>
          <button class="increase">+</button>
          <button class="decrease">-</button>
        </div>`;

      li.querySelector(".increase").addEventListener("click", () => {
        item.qty++;
        renderCart();
      });

      li.querySelector(".decrease").addEventListener("click", () => {
        item.qty--;
        if (item.qty <= 0) delete cart[itemName];
        renderCart();
      });

      cartItemsList.appendChild(li);
    }

    cartCount.innerText = count;
    cartTotal.innerText = total;

    if (count === 0) {
      cartUI.classList.remove("open");
    }
  }

  cartToggle.addEventListener("click", () => {
    cartUI.classList.toggle("open");
  });

  closeCartBtn.addEventListener("click", () => {
    cartUI.classList.remove("open");
  });

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", e => {
      const card = e.target.closest(".food-card");
      const title = card.querySelector("h3").innerText.trim();
      const priceText = card.querySelector("p").innerText.trim();
      const price = parseInt(priceText.replace('₹', ''), 10);

      if (cart[title]) {
        cart[title].qty++;
      } else {
        cart[title] = { price, qty: 1 };
      }
      renderCart();
      cartUI.classList.add("open");
    });
  });

  checkoutBtn.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      alert("Cart is empty!");
      return;
    }

    orderSummary.innerHTML = "";
    let total = 0;
    for (let itemName in cart) {
      const item = cart[itemName];
      total += item.price * item.qty;
      const li = document.createElement("li");
      li.innerText = `${itemName} - ₹${item.price} x ${item.qty}`;
      orderSummary.appendChild(li);
    }
    orderTotal.innerText = total;
    checkoutModal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    checkoutModal.style.display = "none";
  });

  window.addEventListener("click", event => {
    if (event.target === checkoutModal) checkoutModal.style.display = "none";
  });

  placeOrderBtn.addEventListener("click", () => {
    checkoutModal.style.display = "none";
    cartUI.classList.remove("open");

    // Show success overlay
    successContainer.classList.add("show");

    // Clear cart
    for (let item in cart) delete cart[item];
    renderCart();

    // Auto-hide after 5s
    setTimeout(() => successContainer.classList.remove("show"), 5000);
  });

  renderCart();
});
