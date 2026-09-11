import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBbRoIhI0iAaDdgKbA6LsA-YXfFtXcuJPc",
  authDomain: "bagdadbreadfactorybd.firebaseapp.com",
  projectId: "bagdadbreadfactorybd",
  storageBucket: "bagdadbreadfactorybd.firebasestorage.app",
  messagingSenderId: "13667225455",
  appId: "1:13667225455:web:d769af316cd8e28adc229a",
  measurementId: "G-R75HG7EM61"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const products = [
  {
    id: "mezbani-petis",
    name: "Mezbani Petis",
    category: "Savoury",
    price: 30,
    oldPrice: null,
    tag: "Local favourite",
    stock: "Available Sat • Mon • Wed",
    image: "images/web.jpg"
  },
  {
    id: "standard-loaf",
    name: "Standard Loaf Bread",
    category: "Bread",
    price: 60,
    oldPrice: null,
    tag: "Baked daily",
    stock: "In stock",
    image: "images/bread.jpg"
  },
  {
    id: "chicken-burger",
    name: "Chicken Burger",
    category: "Savoury",
    price: 60,
    oldPrice: null,
    tag: "Popular",
    stock: "In stock",
    image: "images/chicken-burger.jpg"
  },
  {
    id: "chicken-fry",
    name: "Chicken Fry",
    category: "Savoury",
    price: 30,
    oldPrice: null,
    tag: "Crispy",
    stock: "In stock",
    image: "images/chicken-fry.jpg"
  },
  {
    id: "chicken-roll",
    name: "Chicken Roll",
    category: "Savoury",
    price: 25,
    oldPrice: null,
    tag: "Fresh",
    stock: "In stock",
    image: "images/chicken-roll.jpg"
  },
  {
    id: "chicken-toast",
    name: "Chicken Toast",
    category: "Savoury",
    price: 35,
    oldPrice: null,
    tag: "Fresh",
    stock: "In stock",
    image: "images/chicken-toast.jpg"
  },
  {
    id: "chicken-samosa",
    name: "Chicken Samosa (Chomuha)",
    category: "Savoury",
    price: 10,
    oldPrice: null,
    tag: "Value pick",
    stock: "In stock",
    image: "images/samosa.jpg"
  },
  {
    id: "chicken-sandwich",
    name: "Chicken Sandwich",
    category: "Savoury",
    price: 30,
    oldPrice: null,
    tag: "Customer favourite",
    stock: "In stock",
    image: "images/chicken-sandwich.jpg"
  },
  {
    id: "chicken-kabab",
    name: "Chicken Kabab",
    category: "Savoury",
    price: 50,
    oldPrice: null,
    tag: "Grilled",
    stock: "In stock",
    image: "images/chicken-kabab.jpg"
  },
  {
    id: "chicken-sashlik",
    name: "Chicken Sashlik",
    category: "Savoury",
    price: 30,
    oldPrice: null,
    tag: "Fresh",
    stock: "In stock",
    image: "images/chicken-sashlik.jpg"
  },
  {
    id: "chicken-chop-burger",
    name: "Chicken Chop Burger",
    category: "Savoury",
    price: 30,
    oldPrice: null,
    tag: "Popular",
    stock: "In stock",
    image: "images/chicken-chop-burger.jpg"
  },
  {
    id: "chicken-bun",
    name: "Chicken Bun",
    category: "Savoury",
    price: 25,
    oldPrice: null,
    tag: "Fresh",
    stock: "In stock",
    image: "images/chicken-bun.jpg"
  },
  {
    id: "egg-chop",
    name: "Egg Chop (Dim Chop)",
    category: "Savoury",
    price: 15,
    oldPrice: null,
    tag: "Classic",
    stock: "In stock",
    image: "images/egg-chop.jpg"
  },
  {
    id: "pizza",
    name: "Pizza",
    category: "Savoury",
    price: 60,
    oldPrice: null,
    tag: "Hot & fresh",
    stock: "In stock",
    image: "images/pizza.jpg"
  },
  {
    id: "hot-dog",
    name: "Hot Dog",
    category: "Savoury",
    price: 30,
    oldPrice: null,
    tag: "Quick bite",
    stock: "In stock",
    image: "images/hot-dog.jpg"
  },
  {
    id: "laddu",
    name: "Laddu (Per Kg)",
    category: "Sweets",
    price: 200,
    oldPrice: null,
    tag: "Traditional",
    stock: "Limited daily",
    image: "images/laddu.jpg"
  },
  {
    id: "vanilla-cake",
    name: "Vanilla Cake (1 Pound)",
    category: "Cakes",
    price: 350,
    oldPrice: null,
    tag: "Celebration",
    stock: "Fresh to order",
    image: "images/vanilla-cake.jpg"
  },
  {
    id: "chocolate-cake",
    name: "Chocolate Cake (1 Pound)",
    category: "Cakes",
    price: 400,
    oldPrice: null,
    tag: "Best seller",
    stock: "Fresh to order",
    image: "images/chocolate-cake-unsplash.jpg"
  }
];


let cart = JSON.parse(localStorage.getItem("bagdadCart") || "[]");
let user = null;
const urlParams = new URLSearchParams(location.search);
let category = urlParams.get("category") || "All";
const initialSearch = urlParams.get("q") || "";


const money = n => `৳${Number(n).toLocaleString("en-BD")}`;
const escapeHtml = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const save = () => {
  localStorage.setItem("bagdadCart", JSON.stringify(cart));
};

const cartCount = () => {
  document.querySelectorAll("#cartCount").forEach(el => {
    el.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  });
};


function renderMenu() {
  const grid = document.getElementById("menuGrid");

  if (!grid) return;

  let list = products.filter(
    product => category === "All" || product.category === category
  );

  const search =
    document.getElementById("menuSearch")?.value?.toLowerCase() || "";

  if (search) {
    list = list.filter(product =>
      `${product.name} ${product.category}`.toLowerCase().includes(search)
    );
  }

  const sort = document.getElementById("menuSort")?.value;

  if (sort === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  grid.innerHTML = list.map(product => `
    <article class="menu-product">

      <div class="menu-product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          decoding="async"
        >

        <span class="tag">${product.tag}</span>
      </div>

      <div class="menu-product-body">

        <small>${product.category}</small>

        <h3>${product.name}</h3>

        <p>${product.stock}</p>

        <div class="menu-price-row">

          <span>
            <b>${money(product.price)}</b>
            ${
              product.oldPrice
                ? `<del>${money(product.oldPrice)}</del>`
                : ""
            }
          </span>

          <button
            class="menu-add"
            data-add="${product.id}"
            aria-label="Add ${product.name} to cart"
          >
            +
          </button>

        </div>

      </div>

    </article>
  `).join("");
}


function renderCart() {
  const list = document.getElementById("cartList");

  if (!list) return;

  const total = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);

    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const summaryTotal = document.getElementById("summaryTotal");
  const summaryItems = document.getElementById("summaryItems");

  if (summaryTotal) {
    summaryTotal.textContent = money(total);
  }

  if (summaryItems) {
    summaryItems.textContent = money(total);
  }

  if (!cart.length) {
    list.innerHTML = `
      <div class="empty-state">
        Your basket is empty.
        <a href="#menuGrid">Explore the menu.</a>
      </div>
    `;

    return;
  }

  list.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.id);

    if (!product) return "";

    return `
      <div class="cart-row">

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <div>

          <h3>${product.name}</h3>

          <small>
            ${money(product.price)} each
          </small>

          <div class="qty">

            <button data-dec="${product.id}">
              −
            </button>

            <b>${item.qty}</b>

            <button data-inc="${product.id}">
              +
            </button>

          </div>

        </div>

        <strong>
          ${money(product.price * item.qty)}
        </strong>

      </div>
    `;
  }).join("");
}


function add(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id,
      qty: 1
    });
  }

  save();
  cartCount();
  renderCart();
}


document.addEventListener("click", event => {

  const addId = event.target.closest("[data-add]")?.dataset.add;

  if (addId) {
    add(addId);
    return;
  }

  const incId = event.target.closest("[data-inc]")?.dataset.inc;

  if (incId) {
    const item = cart.find(item => item.id === incId);

    if (item) {
      item.qty++;
      save();
      renderCart();
      cartCount();
    }

    return;
  }

  const decId = event.target.closest("[data-dec]")?.dataset.dec;

  if (decId) {
    const item = cart.find(item => item.id === decId);

    if (item) {
      item.qty--;

      if (item.qty <= 0) {
        cart = cart.filter(item => item.id !== decId);
      }

      save();
      renderCart();
      cartCount();
    }
  }
});




function normalizeProductName(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function syncStaticMenuFromCatalog() {
  document.querySelectorAll(".product-card[data-name]").forEach(card => {
    const catalogProduct = products.find(p => normalizeProductName(p.name) === normalizeProductName(card.dataset.name));
    if (!catalogProduct) return;
    const priceEl = card.querySelector(".product-card-bottom strong");
    const button = card.querySelector(".add-btn");
    const image = card.querySelector("img");
    if (priceEl) priceEl.textContent = money(catalogProduct.price);
    if (button) {
      button.dataset.price = String(catalogProduct.price);
      button.dataset.id = catalogProduct.id;
      button.dataset.name = catalogProduct.name;
      button.disabled = catalogProduct.available === false || catalogProduct.stock === "Unavailable";
    }
    if (image && catalogProduct.image) {
      image.src = catalogProduct.image;
      image.alt = catalogProduct.name;
    }
  });
}

async function loadProductCatalog() {
  try {
    const snap = await getDocs(collection(db, "products"));
    if (!snap.empty) {
      products.splice(0, products.length, ...snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.active !== false)
        .map(p => ({
          id: p.id,
          name: p.name || p.title || p.id,
          category: p.category || "Other",
          price: Number(p.price || 0),
          oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
          tag: p.tag || (p.featured ? "Featured" : ""),
          stock: p.stock || (p.available === false ? "Unavailable" : "In stock"),
          image: p.image || "images/bread.jpg",
          available: p.available !== false
        })));
    }
  } catch (error) {
    console.warn("Firestore product catalog unavailable; using bundled catalog.", error);
  }
  const searchInput = document.getElementById("menuSearch");
  if (searchInput && initialSearch) searchInput.value = initialSearch;
  syncStaticMenuFromCatalog();
  renderMenu();
  renderCart();
  cartCount();
}

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {

    category = button.dataset.category;

    document
      .querySelectorAll("[data-category]")
      .forEach(item => item.classList.remove("active"));

    button.classList.add("active");

  });
});


document
  .getElementById("menuSearch")
  ?.addEventListener("input", renderMenu);

document
  .getElementById("menuSort")
  ?.addEventListener("change", renderMenu);


// Static menu cards call addToCart(this) inline. Since this file loads as
// a module, it isn't in global scope by default, so it's attached to
// window explicitly and simply forwards to the existing add(id) cart engine.
window.addToCart = function (button) {
  const id = button?.dataset?.id;
  if (!id) return;
  add(id);

  const originalText = button.textContent;
  button.textContent = "Added ✓";
  button.disabled = true;
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 900);
};


document
  .getElementById("checkoutOpen")
  ?.addEventListener("click", () => {

    if (!cart.length) {
      alert("Your basket is empty.");
      return;
    }

    document
      .getElementById("checkoutModal")
      ?.classList.add("open");
  });


document.querySelectorAll(".modal-close").forEach(button => {
  button.addEventListener("click", () => {
    button.closest(".modal")?.classList.remove("open");
  });
});


// ---- Pickup / Delivery toggle inside the checkout modal ----
const deliveryFieldsBox = document.getElementById("deliveryFields");
const pickupFieldsBox = document.getElementById("pickupFields");
const fulfillmentInput = document.getElementById("fulfillmentInput");

function setFulfillment(mode) {
  if (!fulfillmentInput) return;

  fulfillmentInput.value = mode;

  document.querySelectorAll(".fulfillment-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.fulfillment === mode);
  });

  const isDelivery = mode === "delivery";

  deliveryFieldsBox?.classList.toggle("field-hidden", !isDelivery);
  pickupFieldsBox?.classList.toggle("field-hidden", isDelivery);

  // Disable hidden controls so duplicate field names (like payment) never get submitted.
  deliveryFieldsBox?.querySelectorAll("input,textarea,select,button").forEach(field => {
    field.disabled = !isDelivery;
  });
  pickupFieldsBox?.querySelectorAll("input,textarea,select,button").forEach(field => {
    field.disabled = isDelivery;
  });

  // Only require the fields that are actually visible.
  deliveryFieldsBox
    ?.querySelectorAll("[name='area'],[name='address']")
    .forEach(field => { field.required = isDelivery; });
}

document.querySelectorAll(".fulfillment-btn").forEach(btn => {
  btn.addEventListener("click", () => setFulfillment(btn.dataset.fulfillment));
});

// Pickup remains the default, but Delivery can now be selected when available.
setFulfillment("pickup");

// Turn a <input type="datetime-local"> value ("2026-09-06T18:00") into a
// friendly string ("Sun, Sep 6, 6:00 PM") for storage/display. Falls back
// to whatever was typed if it isn't a parseable datetime.
function formatPreferredTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

// Don't let people pick a time in the past.
(function setMinPreferredTimes() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minValue = now.toISOString().slice(0, 16);
  ["deliveryTimeInput", "pickupTimeInput"].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.min = minValue;
  });
})();


document
  .getElementById("checkoutForm")
  ?.addEventListener("submit", async event => {

    event.preventDefault();

    if (!cart.length) {
      alert("Your basket is empty.");
      return;
    }

    const form = Object.fromEntries(
      new FormData(event.target)
    );

    const items = cart
      .map(item => {
        const product = products.find(
          product => product.id === item.id
        );

        if (!product) return null;

        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: item.qty
        };
      })
      .filter(Boolean);

    const total = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const isDelivery = form.fulfillment !== "pickup";

    const customer = {
      name: form.name,
      phone: form.phone
    };

    if (isDelivery) {
      customer.area = form.area;
      customer.address = form.address;
      customer.preferredTime = formatPreferredTime(form.deliveryTime);
      customer.note = form.deliveryNote || "";
    } else {
      customer.pickupBranch = form.pickupBranch || "Main Branch";
      customer.preferredTime = formatPreferredTime(form.pickupTime);
      customer.note = form.pickupNote || "";
    }

    try {

      const orderData = {
        customer,
        fulfillment: isDelivery ? "delivery" : "pickup",
        items,
        total,
        paymentMethod: form.payment || "Cash on delivery",
        orderStatus: "pending",
        userId: user ? user.uid : null,
        createdAt: serverTimestamp()
      };

      const orderRef = await addDoc(
        collection(db, "orders"),
        orderData
      );

      alert(
        isDelivery
          ? `Order placed successfully.\nOrder ID: ${orderRef.id}\nOur team will call you shortly to confirm your delivery time and charge.`
          : `Order placed successfully.\nOrder ID: ${orderRef.id}\nWe'll have it ready at ${customer.pickupBranch}. Our team will call to confirm your pickup time.`
      );

      cart = [];

      save();
      renderCart();
      cartCount();

      document
        .getElementById("checkoutModal")
        ?.classList.remove("open");

      location.href =
        `order-status.html?order=${encodeURIComponent(orderRef.id)}`;

    } catch (error) {

      console.error("Order error:", error);

      alert(
        "Order could not be saved. Please check your Firebase Firestore rules."
      );
    }
  });


document
  .getElementById("cakeForm")
  ?.addEventListener("submit", async event => {

    event.preventDefault();

    try {

      const formData = Object.fromEntries(
        new FormData(event.target)
      );

      await addDoc(
        collection(db, "cakeRequests"),
        {
          ...formData,
          userId: user ? user.uid : null,
          status: "new",
          createdAt: serverTimestamp()
        }
      );

      event.target.reset();

      alert(
        "Your cake request has been sent successfully."
      );

    } catch (error) {

      console.error("Cake request error:", error);

      alert(
        "Cake request could not be saved. Please check Firestore."
      );
    }
  });


document
  .getElementById("searchOpen")
  ?.addEventListener("click", () => {
    document
      .getElementById("searchModal")
      ?.classList.add("open");
  });


document
  .querySelector(".modal")
  ?.addEventListener("click", event => {

    if (event.target.classList.contains("modal")) {
      event.target.classList.remove("open");
    }

  });


document
  .getElementById("globalSearch")
  ?.addEventListener("input", event => {

    const query = event.target.value.toLowerCase();

    const results =
      document.getElementById("globalResults");

    if (!results) return;

    results.innerHTML = products
      .filter(product =>
        product.name.toLowerCase().includes(query)
      )
      .map(product => `
        <a
          class="search-result"
          href="menu.html"
        >
          ${product.name}
          <b>${money(product.price)}</b>
        </a>
      `)
      .join("");
  });


document
  .getElementById("year")
  ?.append(new Date().getFullYear());


const featured =
  document.getElementById("featuredProducts");

if (featured) {

  featured.innerHTML = products
    .slice(0, 4)
    .map(product => `
      <a
        class="home-product"
        href="menu.html"
      >

        <div>

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >

          <span>${product.tag}</span>

        </div>

        <small>${product.category}</small>

        <h3>${product.name}</h3>

        <b>${money(product.price)}</b>

      </a>
    `)
    .join("");
}


loadProductCatalog();

const accountModal =
  document.getElementById("accountModal");

const accountOpen =
  document.getElementById("accountOpen");

const accountClose =
  document.getElementById("accountClose");

const authPanel =
  document.getElementById("authPanel");

const profilePanel =
  document.getElementById("profilePanel");

const accountForm =
  document.getElementById("accountForm");

const accountLoginTab =
  document.getElementById("accountLoginTab");

const accountSignupTab =
  document.getElementById("accountSignupTab");

const accountNameField =
  document.getElementById("accountNameField");

const accountSubmit =
  document.getElementById("accountSubmit");

const accountForgot =
  document.getElementById("accountForgot");

let accountMode = "login";


function openAccount() {

  if (!accountModal) return;

  accountModal.classList.add("is-open");

  accountModal.setAttribute(
    "aria-hidden",
    "false"
  );

  updateAccountPanel(auth.currentUser);
}


function closeAccount() {

  if (!accountModal) return;

  accountModal.classList.remove("is-open");

  accountModal.setAttribute(
    "aria-hidden",
    "true"
  );
}


accountOpen?.addEventListener(
  "click",
  openAccount
);

accountClose?.addEventListener(
  "click",
  closeAccount
);


accountModal?.addEventListener(
  "click",
  event => {

    if (event.target === accountModal) {
      closeAccount();
    }

  }
);


function setAccountMode(mode) {

  accountMode = mode;

  accountLoginTab?.classList.toggle(
    "active",
    mode === "login"
  );

  accountSignupTab?.classList.toggle(
    "active",
    mode === "signup"
  );

  if (accountNameField) {
    accountNameField.hidden =
      mode !== "signup";
  }

  if (accountSubmit) {
    accountSubmit.textContent =
      mode === "signup"
        ? "Create account"
        : "Login";
  }

  if (accountForgot) {
    accountForgot.hidden =
      mode !== "login";
  }
}


accountLoginTab?.addEventListener(
  "click",
  () => setAccountMode("login")
);

accountSignupTab?.addEventListener(
  "click",
  () => setAccountMode("signup")
);


function showAccountMessage(
  message,
  error = false
) {

  let element =
    document.getElementById("accountStatus");

  if (!element) {

    element = document.createElement("p");

    element.id = "accountStatus";

    element.className =
      "account-status";

    accountForm?.before(element);
  }

  element.textContent = message;

  element.classList.toggle(
    "error",
    error
  );
}


accountForm?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    const email =
      document
        .getElementById("accountEmail")
        ?.value
        .trim();

    const password =
      document
        .getElementById("accountPassword")
        ?.value;

    const name =
      document
        .getElementById("accountName")
        ?.value
        .trim() || "";

    try {

      if (accountMode === "signup") {

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        if (name) {

          await updateProfile(
            credential.user,
            {
              displayName: name
            }
          );
        }

        await saveCustomerProfile(
          credential.user,
          {
            name
          }
        );

        showAccountMessage(
          "Account created successfully."
        );

      } else {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        showAccountMessage(
          "Login successful."
        );
      }

    } catch (error) {

      console.error(
        "Authentication error:",
        error
      );

      let message =
        error.message || "Authentication failed.";

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        message =
          "Email or password is incorrect.";
      }

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        message =
          "This email is already registered.";
      }

      if (
        error.code ===
        "auth/weak-password"
      ) {
        message =
          "Password must be at least 6 characters.";
      }

      showAccountMessage(
        message.replace("Firebase: ", ""),
        true
      );
    }
  }
);


document
  .getElementById("googleLogin")
  ?.addEventListener(
    "click",
    async () => {

      try {

        await signInWithPopup(
          auth,
          provider
        );

        showAccountMessage(
          "Google login successful."
        );

      } catch (error) {

        console.error(
          "Google login error:",
          error
        );

        showAccountMessage(
          "Google sign-in failed. Make sure Google is enabled in Firebase Authentication.",
          true
        );
      }
    }
  );


accountForgot?.addEventListener(
  "click",
  async () => {

    const email =
      document
        .getElementById("accountEmail")
        ?.value
        .trim();

    if (!email) {

      showAccountMessage(
        "Enter your email address first.",
        true
      );

      return;
    }

    try {

      await sendPasswordResetEmail(
        auth,
        email
      );

      showAccountMessage(
        "Password reset email sent."
      );

    } catch (error) {

      showAccountMessage(
        error.message.replace(
          "Firebase: ",
          ""
        ),
        true
      );
    }
  }
);


async function compressProfileImage(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload = () => {

        const image =
          new Image();

        image.onload = () => {

          const canvas =
            document.createElement(
              "canvas"
            );

          const max = 320;

          const scale =
            Math.min(
              1,
              max /
                Math.max(
                  image.width,
                  image.height
                )
            );

          canvas.width =
            Math.max(
              1,
              Math.round(
                image.width * scale
              )
            );

          canvas.height =
            Math.max(
              1,
              Math.round(
                image.height * scale
              )
            );

          const context =
            canvas.getContext("2d");

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(
            canvas.toDataURL(
              "image/jpeg",
              0.78
            )
          );
        };

        image.onerror = reject;

        image.src = reader.result;
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    }
  );
}


async function saveCustomerProfile(
  currentUser,
  extra = {}
) {

  if (!currentUser) return;

  const profileRef =
    doc(
      db,
      "users",
      currentUser.uid
    );

  await setDoc(
    profileRef,
    {
      uid: currentUser.uid,
      name:
        extra.name ??
        currentUser.displayName ??
        "",
      email:
        currentUser.email ??
        "",
      phoneNumber:
        extra.phoneNumber ??
        "",
      address:
        extra.address ??
        "",
      photoURL:
        extra.photoURL ??
        currentUser.photoURL ??
        "",
      updatedAt:
        serverTimestamp()
    },
    {
      merge: true
    }
  );
}


async function loadCustomerProfile(
  currentUser
) {

  if (!currentUser) return {};

  try {

    const profileRef =
      doc(
        db,
        "users",
        currentUser.uid
      );

    const snapshot =
      await getDoc(profileRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }

  } catch (error) {

    console.error(
      "Profile loading error:",
      error
    );
  }

  return {};
}


function initials(name = "User") {

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join("")
    .toUpperCase() || "U";
}


function setAvatar(
  element,
  name,
  photo
) {

  if (!element) return;

  if (photo) {

    element.innerHTML = `
      <img
        src="${photo}"
        alt="Profile photo"
      >
    `;

  } else {

    element.textContent =
      initials(name);
  }
}


async function updateAccountPanel(
  currentUser
) {

  if (!accountModal) return;

  if (!currentUser) {

    authPanel?.removeAttribute(
      "hidden"
    );

    profilePanel?.setAttribute(
      "hidden",
      ""
    );

    setAccountMode(
      accountMode
    );

    return;
  }

  authPanel?.setAttribute(
    "hidden",
    ""
  );

  profilePanel?.removeAttribute(
    "hidden"
  );

  const profile =
    await loadCustomerProfile(
      currentUser
    );

  const name =
    profile.name ||
    currentUser.displayName ||
    currentUser.email ||
    "Customer";

  const photo =
    profile.photoURL ||
    currentUser.photoURL ||
    "";

  setAvatar(
    document.getElementById(
      "profileAvatarLarge"
    ),
    name,
    photo
  );

  setAvatar(
    document.getElementById(
      "profilePhotoPreview"
    ),
    name,
    photo
  );

  const nameInput =
    document.getElementById(
      "profileNameInput"
    );

  const phoneInput =
    document.getElementById(
      "profilePhoneInput"
    );

  const addressInput =
    document.getElementById(
      "profileAddressInput"
    );

  if (nameInput) {
    nameInput.value =
      profile.name ||
      currentUser.displayName ||
      "";
  }

  if (phoneInput) {
    phoneInput.value =
      profile.phoneNumber ||
      currentUser.phoneNumber ||
      "";
  }

  if (addressInput) {
    addressInput.value =
      profile.address ||
      "";
  }
}


document
  .getElementById("chooseProfilePhoto")
  ?.addEventListener(
    "click",
    () => {
      document
        .getElementById("profilePhotoFile")
        ?.click();
    }
  );


document
  .getElementById("profilePhotoPreview")
  ?.addEventListener(
    "click",
    () => {
      document
        .getElementById("profilePhotoFile")
        ?.click();
    }
  );


document
  .getElementById("profilePhotoFile")
  ?.addEventListener(
    "change",
    async event => {

      const file =
        event.target.files?.[0];

      if (
        !file ||
        !auth.currentUser
      ) {
        return;
      }

      try {

        const photoURL =
          await compressProfileImage(
            file
          );

        await saveCustomerProfile(
          auth.currentUser,
          {
            photoURL
          }
        );

        await updateAccountPanel(
          auth.currentUser
        );

      } catch (error) {

        console.error(
          "Profile photo error:",
          error
        );

        showAccountMessage(
          "Could not save the profile photo.",
          true
        );
      }
    }
  );


document
  .getElementById("removeProfilePhoto")
  ?.addEventListener(
    "click",
    async () => {

      if (!auth.currentUser) {
        return;
      }

      try {

        await saveCustomerProfile(
          auth.currentUser,
          {
            photoURL: ""
          }
        );

        await updateAccountPanel(
          auth.currentUser
        );

      } catch (error) {

        console.error(
          "Remove photo error:",
          error
        );

        showAccountMessage(
          "Could not remove the profile photo.",
          true
        );
      }
    }
  );


document
  .getElementById("profileForm")
  ?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      if (!auth.currentUser) {
        return;
      }

      const name =
        document
          .getElementById(
            "profileNameInput"
          )
          ?.value
          .trim() || "";

      const phoneNumber =
        document
          .getElementById(
            "profilePhoneInput"
          )
          ?.value
          .trim() || "";

      const address =
        document
          .getElementById(
            "profileAddressInput"
          )
          ?.value
          .trim() || "";

      try {

        if (name) {

          await updateProfile(
            auth.currentUser,
            {
              displayName: name
            }
          );
        }

        await saveCustomerProfile(
          auth.currentUser,
          {
            name,
            phoneNumber,
            address
          }
        );

        await updateAccountPanel(
          auth.currentUser
        );

        if (accountOpen) {

          accountOpen.innerHTML = `
            <span class="account-mini-avatar">
              ${initials(
                name ||
                auth.currentUser.email ||
                "U"
              )}
            </span>
            ${name || "Account"}
          `;
        }

        showAccountMessage(
          "Profile updated successfully."
        );

      } catch (error) {

        console.error(
          "Profile update error:",
          error
        );

        showAccountMessage(
          "Could not save profile changes.",
          true
        );
      }
    }
  );


document
  .getElementById("accountLogout")
  ?.addEventListener(
    "click",
    async () => {

      try {

        await signOut(auth);

        closeAccount();

      } catch (error) {

        console.error(
          "Logout error:",
          error
        );
      }
    }
  );


// ---------- My Orders page (my-orders.html only) ----------
const myOrdersList = document.getElementById("ordersList");

async function renderMyOrdersPage(currentUser) {
  if (!myOrdersList) return; // not on my-orders.html

  const nameEl = document.getElementById("userName");
  const emailEl = document.getElementById("userEmail");
  const avatarEl = document.getElementById("avatar");
  const loginBtn = document.getElementById("googleLogin");

  if (!currentUser) {
    if (nameEl) nameEl.textContent = "Guest";
    if (emailEl) emailEl.textContent = "Please sign in to continue.";
    if (avatarEl) avatarEl.textContent = "B";
    if (loginBtn) loginBtn.style.display = "";
    myOrdersList.innerHTML = "";
    return;
  }

  const displayName = currentUser.displayName || currentUser.email || "Customer";
  if (nameEl) nameEl.textContent = displayName;
  if (emailEl) emailEl.textContent = currentUser.email || "";
  if (avatarEl) avatarEl.textContent = initials(displayName);
  if (loginBtn) loginBtn.style.display = "none";

  myOrdersList.innerHTML = `<div class="notice">Loading your orders...</div>`;

  try {
    const snap = await getDocs(
      query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(50)
      )
    );

    if (snap.empty) {
      myOrdersList.innerHTML = `<div class="notice">You haven't placed any orders yet. <a href="menu.html">Browse the menu</a>.</div>`;
      return;
    }

    myOrdersList.innerHTML = snap.docs.map(docSnap => {
      const o = docSnap.data();
      const id = docSnap.id;
      const created = o.createdAt?.toDate ? o.createdAt.toDate() : null;
      const dateStr = created
        ? created.toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })
        : "—";
      const status = (o.orderStatus || "pending").replaceAll("_", " ");
      const statusClass = `status-${o.orderStatus || "pending"}`;
      const fulfillmentLabel = o.fulfillment === "pickup" ? "🏪 Pickup" : "🚚 Delivery";
      const itemsText = (o.items || []).map(i => `${escapeHtml(i.name)} ×${i.qty}`).join(", ");

      return `
        <a class="search-result" href="order-status.html?order=${encodeURIComponent(id)}" style="display:flex;flex-direction:column;gap:4px;text-decoration:none;color:inherit">
          <div style="display:flex;justify-content:space-between;gap:10px">
            <b>${money(o.total)}</b>
            <span class="status-pill ${statusClass}" style="text-transform:capitalize">${escapeHtml(status)}</span>
          </div>
          <small>${dateStr} • ${fulfillmentLabel}</small>
          <small>${itemsText || "—"}</small>
        </a>
      `;
    }).join("");

  } catch (error) {
    console.error("My orders load failed:", error);
    myOrdersList.innerHTML = `<div class="notice">Could not load your orders right now. Please try again shortly.</div>`;
  }
}


onAuthStateChanged(
  auth,
  async currentUser => {

    user = currentUser;

    renderMyOrdersPage(currentUser);

    if (currentUser) {

      const profile =
        await loadCustomerProfile(
          currentUser
        );

      try {

        await saveCustomerProfile(
          currentUser,
          {
            name:
              profile.name ||
              currentUser.displayName ||
              "",

            phoneNumber:
              profile.phoneNumber ||
              "",

            address:
              profile.address ||
              "",

            photoURL:
              profile.photoURL ||
              currentUser.photoURL ||
              ""
          }
        );

      } catch (error) {

        console.error(
          "Automatic profile save error:",
          error
        );
      }

      if (accountOpen) {

        const name =
          profile.name ||
          currentUser.displayName ||
          currentUser.email ||
          "Account";

        const photoURL =
          profile.photoURL ||
          currentUser.photoURL ||
          "";

        const safeName =
          String(name).replace(/"/g, "&quot;");

        const fallbackLetter =
          String(name).trim().charAt(0).toUpperCase() || "U";

        accountOpen.setAttribute(
          "aria-label",
          "My account"
        );
        accountOpen.setAttribute(
          "title",
          safeName
        );

        accountOpen.innerHTML = photoURL
          ? `
            <span class="account-mini-avatar account-mini-avatar-photo">
              <img src="${photoURL}" alt="" referrerpolicy="no-referrer">
            </span>
          `
          : `
            <span class="account-mini-avatar" aria-hidden="true">
              ${fallbackLetter}
            </span>
          `;
      }

    } else {

      if (accountOpen) {
        accountOpen.removeAttribute("title");
        accountOpen.setAttribute("aria-label", "Account");
        accountOpen.innerHTML =
          '<span class="account-login-label">Account</span>';
      }
    }

    if (
      accountModal?.classList.contains(
        "is-open"
      )
    ) {

      await updateAccountPanel(
        currentUser
      );
    }
  }
);
/* FINAL STICKY LOWER NAVIGATION */
(function(){
  function initStickyLowerNav(){
    var nav=document.querySelector('.header-nav-row');
    if(!nav || nav.dataset.stickyReady) return;
    nav.dataset.stickyReady='1';
    var spacer=document.createElement('div');
    spacer.className='header-nav-spacer';
    nav.parentNode.insertBefore(spacer, nav.nextSibling);
    var originalTop=0;
    function measure(){
      if(!nav.classList.contains('nav-fixed')) originalTop=nav.getBoundingClientRect().top+window.scrollY;
    }
    function update(){
      if(window.innerWidth<=900){
        nav.classList.remove('nav-fixed'); spacer.classList.remove('is-active'); return;
      }
      if(!originalTop) measure();
      if(window.scrollY>=originalTop){
        nav.classList.add('nav-fixed'); spacer.classList.add('is-active');
      }else{
        nav.classList.remove('nav-fixed'); spacer.classList.remove('is-active'); measure();
      }
    }
    measure(); update();
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',function(){nav.classList.remove('nav-fixed');spacer.classList.remove('is-active');originalTop=0;setTimeout(function(){measure();update()},30)});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initStickyLowerNav);
  else initStickyLowerNav();
})();

/* STATIC MENU PAGE: category tiles (?category=) and header search (?q=)
   filtering. menu.html renders its products as static .product-card
   markup (see the addToCart() comment above) rather than through
   renderMenu(), so neither the ?category= links on the homepage nor the
   ?q= header search box had any effect on this page before. This wires
   both up against the real markup. */
(function initStaticMenuFilters() {
  const cards = document.querySelectorAll(".product-card");
  if (!cards.length) return;

  const sections = document.querySelectorAll("[data-category-section]");
  const params = new URLSearchParams(location.search);
  const categoryParam = (params.get("category") || "").trim().toLowerCase();
  const searchParam = (params.get("q") || "").trim().toLowerCase();

  const categoryAliases = {
    cakes: "celebration cakes",
    sweets: "traditional sweets",
    bread: "bread selection",
    savoury: "fast food & snacks",
    savouries: "fast food & snacks"
  };
  const targetCategory = categoryAliases[categoryParam] || categoryParam;

  const searchInput = document.getElementById("menuSearch") || document.querySelector('.header-search input[name="q"]');
  if (searchInput && searchParam) searchInput.value = params.get("q");

  let visibleCount = 0;
  cards.forEach(card => {
    const cardCategory = (card.dataset.category || "").toLowerCase();
    const cardName = (card.dataset.name || card.querySelector("h3")?.textContent || "").toLowerCase();
    const matchesCategory = !targetCategory || cardCategory === targetCategory;
    const matchesSearch = !searchParam || cardName.includes(searchParam) || cardCategory.includes(searchParam);
    const show = matchesCategory && matchesSearch;
    card.style.display = show ? "" : "none";
    if (show) visibleCount++;
  });

  sections.forEach(section => {
    const sectionCategory = (section.dataset.categorySection || "").toLowerCase();
    const hasVisibleCard = [...section.querySelectorAll(".product-card")].some(c => c.style.display !== "none");
    const matchesSection = !targetCategory || sectionCategory === targetCategory;
    section.style.display = (matchesSection && hasVisibleCard) ? "" : "none";
  });

  let emptyState = document.getElementById("menuFilterEmpty");
  if (!visibleCount) {
    if (!emptyState) {
      emptyState = document.createElement("p");
      emptyState.id = "menuFilterEmpty";
      emptyState.className = "empty-state";
      emptyState.style.textAlign = "center";
      emptyState.style.padding = "40px 16px";
      const container = document.querySelector(".menu-category-section")?.parentElement || document.body;
      container.appendChild(emptyState);
    }
    emptyState.textContent = searchParam
      ? `No products match "${params.get("q")}".`
      : "No products found in this category.";
  } else if (emptyState) {
    emptyState.remove();
  }

  if (targetCategory) {
    const activeSection = [...sections].find(s => (s.dataset.categorySection || "").toLowerCase() === targetCategory);
    activeSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
