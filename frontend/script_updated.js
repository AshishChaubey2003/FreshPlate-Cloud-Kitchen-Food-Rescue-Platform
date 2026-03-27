// ===== FreshPlate v2.0 - Full Featured =====
const API_BASE_URL =
  "https://freshplate-cloud-kitchen-food-rescue-2rv3.onrender.com/api";

// ===== TOKEN MANAGEMENT =====
const Auth = {
  getToken: () => localStorage.getItem("fp_access_token"),
  setTokens: (access, refresh) => {
    localStorage.setItem("fp_access_token", access);
    localStorage.setItem("fp_refresh_token", refresh);
  },
  clear: () => {
    localStorage.removeItem("fp_access_token");
    localStorage.removeItem("fp_refresh_token");
    localStorage.removeItem("fp_user");
  },
  getUser: () => {
    const u = localStorage.getItem("fp_user");
    return u ? JSON.parse(u) : null;
  },
  setUser: (user) => localStorage.setItem("fp_user", JSON.stringify(user)),
  isLoggedIn: () => !!localStorage.getItem("fp_access_token"),
  headers: () => {
    const token = localStorage.getItem("fp_access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },
};

document.addEventListener("DOMContentLoaded", function () {
  let cart = [];

  // ===== INJECT ALL MODALS =====
  document.body.insertAdjacentHTML(
    "beforeend",
    `

    <!-- AUTH MODAL -->
    <div id="authModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.6); z-index:10000; justify-content:center; align-items:center;">
        <div style="background:white; border-radius:20px; width:90%; max-width:420px; padding:32px; position:relative;">
            <button onclick="document.getElementById('authModal').style.display='none'"
                style="position:absolute; top:16px; right:16px; background:none; border:none; font-size:24px; cursor:pointer;">✕</button>

            <!-- Login Form -->
            <div id="loginForm">
                <h2 style="color:#388E3C; margin-bottom:8px; text-align:center;">👋 Welcome Back!</h2>
                <p style="color:#757575; text-align:center; margin-bottom:24px;">FreshPlate mein login karo</p>
                <input id="loginUsername" type="text" placeholder="Email ya Username"
                    style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:10px;
                    margin-bottom:12px; font-size:14px; box-sizing:border-box;" />
                <input id="loginPassword" type="password" placeholder="Password"
                    style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:10px;
                    margin-bottom:16px; font-size:14px; box-sizing:border-box;" />
                <button id="loginBtn" style="width:100%; padding:14px; background:#4CAF50; color:white;
                    border:none; border-radius:10px; font-size:16px; font-weight:600; cursor:pointer;">
                    Login Karo
                </button>
                <p style="text-align:center; margin-top:16px; color:#757575;">
                    Account nahi hai?
                    <a href="#" onclick="switchToRegister()" style="color:#4CAF50; font-weight:600;">Register karo</a>
                </p>
            </div>

            <!-- Register Form -->
            <div id="registerForm" style="display:none;">
                <h2 style="color:#388E3C; margin-bottom:8px; text-align:center;">🍽️ Join FreshPlate!</h2>
                <p style="color:#757575; text-align:center; margin-bottom:20px;">Naya account banao</p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                    <input id="regFirst" type="text" placeholder="Pehla Naam"
                        style="padding:12px; border:2px solid #E8F5E9; border-radius:10px; font-size:14px;" />
                    <input id="regLast" type="text" placeholder="Aakhri Naam"
                        style="padding:12px; border:2px solid #E8F5E9; border-radius:10px; font-size:14px;" />
                </div>
                <input id="regEmail" type="email" placeholder="Email *"
                    style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:10px;
                    margin-bottom:10px; font-size:14px; box-sizing:border-box;" />
                <input id="regPhone" type="tel" placeholder="Phone Number"
                    style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:10px;
                    margin-bottom:10px; font-size:14px; box-sizing:border-box;" />
                <input id="regUsername" type="text" placeholder="Username *"
                    style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:10px;
                    margin-bottom:10px; font-size:14px; box-sizing:border-box;" />
                <input id="regPassword" type="password" placeholder="Password (min 6 characters) *"
                    style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:10px;
                    margin-bottom:16px; font-size:14px; box-sizing:border-box;" />
                <button id="registerBtn" style="width:100%; padding:14px; background:#4CAF50; color:white;
                    border:none; border-radius:10px; font-size:16px; font-weight:600; cursor:pointer;">
                    Account Banao
                </button>
                <p style="text-align:center; margin-top:16px; color:#757575;">
                    Pehle se account hai?
                    <a href="#" onclick="switchToLogin()" style="color:#4CAF50; font-weight:600;">Login karo</a>
                </p>
            </div>
        </div>
    </div>

    <!-- CART MODAL -->
    <div id="cartModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
        <div style="background:white; border-radius:16px; width:90%; max-width:500px;
            max-height:80vh; overflow-y:auto; padding:24px; position:relative;">
            <button id="closeCart" style="position:absolute; top:16px; right:16px; background:none;
                border:none; font-size:24px; cursor:pointer; color:#757575;">✕</button>
            <h2 style="color:#388E3C; margin-bottom:20px;">🛒 Aapka Cart</h2>
            <div id="cartItems"></div>
            <div id="cartFooter" style="border-top:2px solid #E8F5E9; margin-top:16px; padding-top:16px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
                    <strong style="font-size:18px;">Total:</strong>
                    <strong id="cartTotal" style="font-size:22px; color:#4CAF50;">₹0</strong>
                </div>
                <button id="placeOrderBtn" style="width:100%; padding:14px; background:#4CAF50; color:white;
                    border:none; border-radius:10px; font-size:16px; font-weight:600; cursor:pointer;">
                    ✅ Order Place Karo
                </button>
                <button id="clearCartBtn" style="width:100%; margin-top:8px; padding:10px;
                    background:none; border:2px solid #F44336; color:#F44336; border-radius:10px;
                    font-size:14px; cursor:pointer; font-weight:600;">
                    🗑️ Poora Cart Saaf Karo
                </button>
            </div>
            <div id="emptyCartMsg" style="text-align:center; padding:40px; display:none;">
                <div style="font-size:48px;">🛒</div>
                <p style="color:#757575; margin-top:12px;">Cart khali hai!</p>
            </div>
        </div>
    </div>

    <!-- ORDER FORM MODAL -->
    <div id="orderModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
        <div style="background:white; border-radius:16px; width:90%; max-width:480px;
            padding:24px; position:relative; max-height:90vh; overflow-y:auto;">
            <button id="closeOrderModal" style="position:absolute; top:16px; right:16px;
                background:none; border:none; font-size:24px; cursor:pointer;">✕</button>
            <h2 style="color:#388E3C; margin-bottom:20px;">📦 Delivery Details</h2>
            <input id="oName" type="text" placeholder="Aapka Naam *"
                style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:8px;
                font-size:14px; box-sizing:border-box; margin-bottom:10px;" />
            <input id="oEmail" type="email" placeholder="Email *"
                style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:8px;
                font-size:14px; box-sizing:border-box; margin-bottom:10px;" />
            <input id="oPhone" type="tel" placeholder="Phone Number *"
                style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:8px;
                font-size:14px; box-sizing:border-box; margin-bottom:10px;" />
            <textarea id="oAddress" placeholder="Delivery Address *" rows="3"
                style="width:100%; padding:12px; border:2px solid #E8F5E9; border-radius:8px;
                font-size:14px; resize:none; box-sizing:border-box; margin-bottom:16px;"></textarea>
            <button id="confirmOrderBtn" style="width:100%; padding:14px; background:#4CAF50; color:white;
                border:none; border-radius:10px; font-size:16px; font-weight:600; cursor:pointer;">
                🎉 Order Confirm Karo
            </button>
        </div>
    </div>

    <!-- ORDER TRACKING MODAL -->
    <div id="trackingModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
        <div style="background:white; border-radius:16px; width:90%; max-width:500px;
            padding:28px; position:relative;">
            <button onclick="document.getElementById('trackingModal').style.display='none'"
                style="position:absolute; top:16px; right:16px; background:none; border:none;
                font-size:24px; cursor:pointer;">✕</button>
            <h2 style="color:#388E3C; margin-bottom:20px;">📍 Order Track Karo</h2>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <input id="trackOrderId" type="number" placeholder="Order ID daalo"
                    style="flex:1; padding:12px; border:2px solid #E8F5E9; border-radius:8px; font-size:14px;" />
                <button id="trackBtn" style="padding:12px 20px; background:#4CAF50; color:white;
                    border:none; border-radius:8px; cursor:pointer; font-weight:600;">Track</button>
            </div>
            <div id="trackingResult"></div>
        </div>
    </div>

    `,
  );

  // ===== NAVBAR UPDATE =====
  function updateNavbar() {
    const navLinks = document.querySelector(".nav-links");
    const existingAuthBtn = document.getElementById("navAuthBtn");
    if (existingAuthBtn) existingAuthBtn.remove();

    const li = document.createElement("li");
    li.id = "navAuthBtn";

    if (Auth.isLoggedIn()) {
      const user = Auth.getUser();
      li.innerHTML = `<div style="display:flex; align-items:center; gap:6px;">
                <span style="color:#4CAF50; font-weight:600; font-size:13px; white-space:nowrap;">
                  👤 ${user?.first_name || user?.username || "User"}</span>
                <button onclick="logoutUser()" style="padding:5px 12px; background:#ffebee;
                    color:#F44336; border:1px solid #F44336; border-radius:20px;
                    cursor:pointer; font-size:12px; font-weight:600; white-space:nowrap;">Logout</button>
            </div>`;
    } else {
      li.innerHTML = `<button onclick="document.getElementById('authModal').style.display='flex'"
                style="padding:6px 14px; background:white; color:#4CAF50; border:2px solid #4CAF50;
                border-radius:20px; cursor:pointer; font-weight:600; font-size:13px; white-space:nowrap;">
                🔑 Login
            </button>`;
    }
    const orderNowLi = navLinks?.querySelector(".order-now-btn")?.parentElement;
    if (orderNowLi) {
      navLinks.insertBefore(li, orderNowLi);
    } else {
      navLinks?.appendChild(li);
    }
  }

  // ===== AUTH FUNCTIONS =====
  window.switchToRegister = () => {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
  };
  window.switchToLogin = () => {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  };

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!username || !password) {
      showNotification("❌ Username aur password daalo!", "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        Auth.setTokens(data.tokens.access, data.tokens.refresh);
        Auth.setUser(data.user);
        document.getElementById("authModal").style.display = "none";
        updateNavbar();
        showNotification(data.message || "Login ho gaya! 🎉");
        prefillOrderForm(data.user);
      } else {
        showNotification("❌ " + (data.error || "Login failed!"), "error");
      }
    } catch {
      showNotification("❌ Server se connect nahi hua!", "error");
    }
  });

  document.getElementById("registerBtn").addEventListener("click", async () => {
    const data = {
      first_name: document.getElementById("regFirst").value.trim(),
      last_name: document.getElementById("regLast").value.trim(),
      email: document.getElementById("regEmail").value.trim(),
      phone: document.getElementById("regPhone").value.trim(),
      username: document.getElementById("regUsername").value.trim(),
      password: document.getElementById("regPassword").value.trim(),
    };
    if (!data.email || !data.username || !data.password) {
      showNotification("❌ Starred fields fill karo!", "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resp = await res.json();
      if (res.ok) {
        Auth.setTokens(resp.tokens.access, resp.tokens.refresh);
        Auth.setUser(resp.user);
        document.getElementById("authModal").style.display = "none";
        updateNavbar();
        showNotification(resp.message || "Account ban gaya! 🎉");
        prefillOrderForm(resp.user);
      } else {
        const errors = Object.values(resp).flat().join(", ");
        showNotification("❌ " + errors, "error");
      }
    } catch {
      showNotification("❌ Server se connect nahi hua!", "error");
    }
  });

  window.logoutUser = () => {
    Auth.clear();
    updateNavbar();
    showNotification("Logout ho gaya! Phir milenge 👋");
  };

  function prefillOrderForm(user) {
    if (user) {
      if (document.getElementById("oName"))
        document.getElementById("oName").value =
          `${user.first_name || ""} ${user.last_name || ""}`.trim();
      if (document.getElementById("oEmail"))
        document.getElementById("oEmail").value = user.email || "";
      if (document.getElementById("oPhone") && user.phone)
        document.getElementById("oPhone").value = user.phone;
    }
  }

  // ===== CART FUNCTIONS =====
  function renderCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    const emptyMsg = document.getElementById("emptyCartMsg");
    const cartFooter = document.getElementById("cartFooter");

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "";
      emptyMsg.style.display = "block";
      cartFooter.style.display = "none";
      return;
    }
    emptyMsg.style.display = "none";
    cartFooter.style.display = "block";

    cartItemsDiv.innerHTML = cart
      .map(
        (item, index) => `
            <div style="display:flex; align-items:center; justify-content:space-between;
                padding:12px; border-bottom:1px solid #E8F5E9; gap:10px;">
                <div style="flex:1;">
                    <div style="font-weight:600; color:#2E2E2E;">${item.name}</div>
                    <div style="color:#4CAF50; font-weight:600;">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <button onclick="changeQty(${index}, -1)" style="width:32px; height:32px; border-radius:50%;
                        border:2px solid #4CAF50; background:white; color:#4CAF50; font-size:18px; cursor:pointer;">−</button>
                    <span style="font-weight:700; min-width:24px; text-align:center;">${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)" style="width:32px; height:32px; border-radius:50%;
                        border:none; background:#4CAF50; color:white; font-size:18px; cursor:pointer;">+</button>
                    <button onclick="removeFromCart(${index})" style="width:32px; height:32px; border-radius:50%;
                        border:none; background:#ffebee; color:#F44336; cursor:pointer; margin-left:4px;">🗑️</button>
                </div>
            </div>`,
      )
      .join("");

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    document.getElementById("cartTotal").textContent = `₹${total.toFixed(2)}`;
  }

  window.changeQty = (index, delta) => {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartCount();
    renderCart();
  };
  window.removeFromCart = (index) => {
    const name = cart[index].name;
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
    showNotification(`${name} cart se hata diya! 🗑️`);
  };

  document
    .getElementById("closeCart")
    .addEventListener(
      "click",
      () => (document.getElementById("cartModal").style.display = "none"),
    );
  document.getElementById("cartModal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("cartModal"))
      document.getElementById("cartModal").style.display = "none";
  });
  document.getElementById("clearCartBtn").addEventListener("click", () => {
    cart = [];
    updateCartCount();
    renderCart();
    showNotification("Cart saaf ho gaya! 🗑️");
  });
  document.getElementById("placeOrderBtn").addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "none";
    if (Auth.isLoggedIn()) prefillOrderForm(Auth.getUser());
    document.getElementById("orderModal").style.display = "flex";
  });
  document
    .getElementById("closeOrderModal")
    .addEventListener(
      "click",
      () => (document.getElementById("orderModal").style.display = "none"),
    );

  // ===== ORDER CONFIRM =====
  document
    .getElementById("confirmOrderBtn")
    .addEventListener("click", async () => {
      const name = document.getElementById("oName").value.trim();
      const email = document.getElementById("oEmail").value.trim();
      const phone = document.getElementById("oPhone").value.trim();
      const address = document.getElementById("oAddress").value.trim();
      if (!name || !email || !phone || !address) {
        showNotification("❌ Saari fields fill karo!", "error");
        return;
      }
      const orderData = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_address: address,
        items: cart.map((i) => ({ menu_item_id: i.id, quantity: i.quantity })),
      };
      try {
        const res = await fetch(`${API_BASE_URL}/orders/create/`, {
          method: "POST",
          headers: Auth.headers(),
          body: JSON.stringify(orderData),
        });
        const data = await res.json();
        if (res.ok) {
          document.getElementById("orderModal").style.display = "none";
          cart = [];
          updateCartCount();
          showNotification(`🎉 Order #${data.order.id} place ho gaya!`);
          setTimeout(() => {
            if (confirm(`Order #${data.order.id} track karna hai?`)) {
              openTracking(data.order.id);
            }
          }, 1500);
        } else {
          showNotification("❌ Order failed!", "error");
        }
      } catch {
        showNotification("❌ Server se connect nahi hua!", "error");
      }
    });

  // ===== ORDER TRACKING =====
  function openTracking(orderId = "") {
    document.getElementById("trackingModal").style.display = "flex";
    if (orderId) {
      document.getElementById("trackOrderId").value = orderId;
      trackOrder(orderId);
    }
  }
  window.openTracking = openTracking;

  document.getElementById("trackBtn").addEventListener("click", () => {
    const id = document.getElementById("trackOrderId").value;
    if (id) trackOrder(id);
  });

  async function trackOrder(orderId) {
    const resultDiv = document.getElementById("trackingResult");
    resultDiv.innerHTML =
      '<p style="text-align:center; color:#757575;">Loading...</p>';
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/`, {
        headers: Auth.headers(),
      });
      const order = await res.json();
      if (!res.ok) {
        resultDiv.innerHTML = '<p style="color:red;">Order nahi mila.</p>';
        return;
      }

      const steps = [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
      ];
      const stepLabels = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
      ];
      const stepIcons = ["🕐", "✅", "👨‍🍳", "🚚", "🎉"];
      const currentStep = steps.indexOf(order.status);

      resultDiv.innerHTML = `
                <div style="background:#f8fdf8; border-radius:12px; padding:16px; margin-bottom:16px;">
                    <h3 style="color:#388E3C;">Order #${order.id}</h3>
                    <p style="color:#757575;">👤 ${order.customer_name}</p>
                    <p style="color:#757575;">💰 Total: ₹${order.total_amount} | 
                       💳 Payment: <strong style="color:${order.payment_status === "paid" ? "#4CAF50" : "#FF9800"}">${order.payment_status}</strong></p>
                </div>
                <div style="display:flex; justify-content:space-between; position:relative; margin:20px 0;">
                    <div style="position:absolute; top:20px; left:10%; right:10%; height:4px;
                        background:#E8F5E9; border-radius:2px;">
                        <div style="height:100%; background:#4CAF50; border-radius:2px;
                            width:${currentStep < 0 ? 0 : (currentStep / (steps.length - 1)) * 100}%;
                            transition:width 0.5s;"></div>
                    </div>
                    ${steps
                      .map(
                        (s, i) => `
                        <div style="display:flex; flex-direction:column; align-items:center; z-index:1; flex:1;">
                            <div style="width:40px; height:40px; border-radius:50%; display:flex;
                                align-items:center; justify-content:center; font-size:18px;
                                background:${i <= currentStep ? "#4CAF50" : "#E8F5E9"};
                                border:3px solid ${i <= currentStep ? "#388E3C" : "#C8E6C9"};">
                                ${stepIcons[i]}
                            </div>
                            <span style="font-size:10px; color:${i <= currentStep ? "#388E3C" : "#9E9E9E"};
                                margin-top:6px; text-align:center; font-weight:${i === currentStep ? "700" : "400"};">
                                ${stepLabels[i]}
                            </span>
                        </div>`,
                      )
                      .join("")}
                </div>
                <div style="background:#E8F5E9; border-radius:8px; padding:12px; text-align:center; margin-top:10px;">
                    <strong style="color:#388E3C; font-size:16px;">
                        ${
                          order.status === "delivered"
                            ? "🎉 Delivered!"
                            : order.status === "out_for_delivery"
                              ? "🚚 Raaste mein hai!"
                              : order.status === "preparing"
                                ? "👨‍🍳 Ban raha hai!"
                                : order.status === "confirmed"
                                  ? "✅ Confirm ho gaya!"
                                  : "⏳ Processing..."
                        }
                    </strong>
                </div>`;
    } catch {
      resultDiv.innerHTML =
        '<p style="color:red;">Error aaya, dobara try karo.</p>';
    }
  }

  // ===== MENU LOAD (Retry logic with cold start support) =====
  async function loadMenuItems(category = "all") {
    const menuGrid = document.querySelector(".menu-grid");
    if (!menuGrid) return;

    menuGrid.innerHTML = `<div style="text-align:center; padding:40px; grid-column:1/-1">
      <div class="spinner"></div>
      <p style="margin-top:10px; color:var(--gray)">Menu load ho raha hai...<br>
      <small style="color:#aaa;">(Pehli baar 30 sec lag sakte hain, backend jag raha hai)</small></p>
    </div>`;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const url =
          category === "all"
            ? `${API_BASE_URL}/menu/`
            : `${API_BASE_URL}/menu/?category=${category}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        const items = data.results || data;
        if (!items.length) {
          menuGrid.innerHTML =
            '<p style="text-align:center; grid-column:1/-1; color:var(--gray)">Koi item nahi.</p>';
          return;
        }
        renderMenuItems(items, menuGrid);
        return; // success - bahar niklo
      } catch {
        if (attempt < 3) {
          menuGrid.innerHTML = `<div style="text-align:center; padding:40px; grid-column:1/-1">
            <div class="spinner"></div>
            <p style="color:var(--gray)">Backend se connect ho raha hai... (${attempt}/3)<br>
            <small style="color:#aaa;">Thoda wait karo, almost ready hai...</small></p>
          </div>`;
          await new Promise((r) => setTimeout(r, 8000)); // 8 sec wait
        } else {
          menuGrid.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:red; padding:40px;">
            ⚠️ Backend connect nahi hua.<br><br>
            <button onclick="loadMenuItems('${category}')"
              style="padding:10px 24px; background:#4CAF50; color:white; border:none;
              border-radius:8px; cursor:pointer; font-size:15px; font-weight:600;">
              🔄 Dobara Try Karo
            </button>
          </p>`;
        }
      }
    }
  }

  function renderMenuItems(items, menuGrid) {
    menuGrid.innerHTML = items
      .map(
        (item) => `
            <div class="menu-item" data-category="${item.category}">
                <img src="${item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"}"
                     alt="${item.name}"
                     onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'"
                     loading="lazy">
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-item-price">₹${parseFloat(item.price).toFixed(2)}</div>
                    <button class="btn btn-primary add-to-cart"
                            data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                        <i class="fas fa-plus"></i> Add to Cart
                    </button>
                </div>
            </div>`,
      )
      .join("");
    document
      .querySelectorAll(".add-to-cart")
      .forEach((btn) => btn.addEventListener("click", addToCart));
  }

  function addToCart(e) {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    const item = {
      id: parseInt(btn.dataset.id),
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price),
    };
    const existing = cart.find((c) => c.id === item.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, quantity: 1 });
    updateCartCount();
    showNotification(`${item.name} cart mein add ho gaya! 🛒`);
  }

  function updateCartCount() {
    let cartCount = document.querySelector(".cart-count");
    const orderBtn = document.querySelector(".nav-links .btn-primary");
    if (!cartCount && orderBtn) {
      cartCount = document.createElement("span");
      cartCount.className = "cart-count";
      orderBtn.addEventListener("click", (e) => {
        if (cart.length > 0) {
          e.preventDefault();
          renderCart();
          document.getElementById("cartModal").style.display = "flex";
        }
      });
      orderBtn.appendChild(cartCount);
    }
    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    if (cartCount) {
      cartCount.textContent = totalQty;
      cartCount.style.display = totalQty > 0 ? "inline-flex" : "none";
      Object.assign(cartCount.style, {
        marginLeft: "8px",
        background: "var(--secondary)",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
      });
    }
  }

  // Contact form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const inputs = this.querySelectorAll("input, textarea");
      try {
        const res = await fetch(`${API_BASE_URL}/contact/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: inputs[0].value,
            email: inputs[1].value,
            message: inputs[2].value,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          showNotification(data.message || "📨 Message send ho gaya!");
          this.reset();
        }
      } catch {
        showNotification("❌ Message send nahi hua.", "error");
      }
    });
  }

  // Category filter
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      loadMenuItems(this.dataset.category);
    });
  });

  // Notification
  function showNotification(message, type = "success") {
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();
    const n = document.createElement("div");
    n.className = "notification";
    if (type === "error") n.style.background = "var(--error, #F44336)";
    n.innerHTML = `<div class="notification-content">
            <i class="fas fa-${type === "error" ? "times" : "check"}-circle"></i>
            <span>${message}</span></div>`;
    document.body.appendChild(n);
    setTimeout(() => {
      if (n.parentNode) n.remove();
    }, 3000);
  }

  // Mobile menu
  const mobileMenu = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");
  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Stats animation
  function animateStats() {
    document.querySelectorAll(".stat-number").forEach((stat) => {
      const target = parseInt(stat.dataset.count);
      let current = 0;
      const inc = target / 100;
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          stat.textContent = target.toLocaleString();
          clearInterval(timer);
        } else stat.textContent = Math.floor(current).toLocaleString();
      }, 20);
    });
  }
  const statsSection = document.querySelector(".rescue-stats");
  if (statsSection) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) animateStats();
        });
      },
      { threshold: 0.5 },
    ).observe(statsSection);
  }

  // Track Order link navbar mein
  const navUl = document.querySelector(".nav-links");
  if (navUl) {
    const trackLi = document.createElement("li");
    trackLi.innerHTML = `<a href="#" onclick="openTracking()" style="color:var(--dark); font-size:14px;">
            📍 Track Order</a>`;
    const orderBtn = navUl.querySelector(".order-now-btn")?.parentElement;
    if (orderBtn) {
      navUl.insertBefore(trackLi, orderBtn);
    } else {
      navUl.appendChild(trackLi);
    }
  }

  // ===== INIT =====
  updateNavbar();
  loadMenuItems();
  if (Auth.isLoggedIn()) prefillOrderForm(Auth.getUser());
  console.log("FreshPlate v2.0 initialized! 🚀");
});
