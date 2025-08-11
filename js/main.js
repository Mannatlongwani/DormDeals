// public/js/main.js
// ----- CONFIG -----
const API_BASE = "http://localhost:3001/api"; // change to your backend host/port if different

// ----- AUTH STORAGE HELPERS -----
function getAuth() {
  return JSON.parse(localStorage.getItem("auth") || "null");
}
function setAuth(data) {
  localStorage.setItem("auth", JSON.stringify(data)); // store entire auth object
}
function clearAuth() {
  localStorage.removeItem("auth");
}

// ----- NAVBAR & FOOTER RENDER -----
function renderNav(containerId = "navbar-container", footerId = "footer-container") {
    const auth = getAuth();
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark-theme", savedTheme === "dark");
  
    // Navbar HTML
    const navHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom" aria-label="Main navigation">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="/">
          <i class="bi bi-bag-fill fs-4 me-2" aria-hidden="true"></i>
          <span class="fw-bold">DormDeals</span>
        </a>
  
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain"
          aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="/"><i class="bi bi-house me-1"></i>Home</a></li>
            <li class="nav-item"><a class="nav-link" href="browse.html"><i class="bi bi-search me-1"></i>Browse</a></li>
            <li class="nav-item"><a class="nav-link" href="sell.html"><i class="bi bi-plus-circle me-1"></i>Sell</a></li>
            <li class="nav-item"><a class="nav-link" href="about.html"><i class="bi bi-info-circle me-1"></i>About</a></li>
            
            ${
              auth && auth.user
                ? `<li class="nav-item"><a class="nav-link" href="profile.html"><i class="bi bi-person me-1"></i>Profile</a></li>
                   <li class="nav-item"><button class="nav-link" id="logoutBtn"><i class="bi bi-box-arrow-right me-1"></i>Logout</button></li>`
                : `<li class="nav-item"><a class="nav-link" href="login.html"><i class="bi bi-box-arrow-in-right me-1"></i>Login</a></li>
                   <li class="nav-item"><a class="nav-link" href="register.html"><i class="bi bi-person-plus me-1"></i>Register</a></li>`
            }
            <li class="nav-item">
            <button class="btn btn-outline-secondary ms-3" id="themeToggle" aria-label="Toggle theme">
              <i class="bi bi-moon-fill"></i>
            </button>
          </li>
          </ul>
        </div>
      </div>
    </nav>
    `;
  
    // Footer HTML (sticky-ready)
// Replace the existing footerHTML with this:

const footerHTML = `
<footer class="border-top py-4 mt-auto">
  <div class="container">
    <div class="row justify-content-evenly text-center text-md-start">
      
      <div class="col-md-3 mb-3">
        <h5><i class="bi bi-info-circle-fill me-2 text-primary"></i>About DormDeals</h5>
        <p>
          A marketplace to facilitate selling, purchasing and giving away of goods that are no longer being used.
        </p>
      </div>
      
      <div class="col-md-3 mb-3">
        <h5><i class="bi bi-link-45deg me-2 text-primary"></i>Quick Links</h5>
        <ul class="list-unstyled">
          <li><a href="/" class="text-decoration-none"><i class="bi bi-house-door-fill me-1"></i>Home</a></li>
          <li><a href="about.html" class="text-decoration-none"><i class="bi bi-info-circle me-1"></i>About us</a></li>
        </ul>
      </div>
      
      <div class="col-md-3 mb-3">
        <h5><i class="bi bi-telephone-fill me-2 text-primary"></i>Contact Us</h5>
        <address>
          <i class="bi bi-geo-alt-fill me-1"></i> IIM Rohtak, Haryana, India<br/>
          <i class="bi bi-envelope-fill me-1"></i> <a href="support@dormdeals.com" class="text-decoration-none ">support@dormdeals.com</a><br/>
          <i class="bi bi-phone-fill me-1"></i> +91 9983596506
        </address>
      </div>

    </div>
    <div class="text-center mt-3">
      <small class="">© <span id="year"></span> DormDeals</small>
    </div>
  </div>
</footer>
`;


  
    // Inject Navbar
    const navContainer = document.getElementById(containerId);
    if (navContainer) navContainer.innerHTML = navHTML;
  
    // Inject Footer
    const footerContainer = document.getElementById(footerId);
    if (footerContainer) footerContainer.innerHTML = footerHTML;
  
    // Update year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    // Logout handler
    if (auth && auth.user) {
      const btn = document.getElementById("logoutBtn");
      if (btn) btn.addEventListener("click", async () => {
        try {
          const refreshToken = auth.refreshToken;
          await fetch(API_BASE + "/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
          });
        } catch (err) {
          console.warn("Logout request failed", err);
        }
        clearAuth();
        window.location.href = "login.html";
      });
    }
    const themeToggleBtn = document.getElementById("themeToggle");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.body.classList.toggle("dark-theme", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        // Change icon based on theme
        themeToggleBtn.innerHTML = newTheme === "dark" ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
      });

      themeToggleBtn.innerHTML = savedTheme === "dark" ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
  }
}
  

// ----- AUTH ACTIONS -----
async function doLogin(mail, password) {
  const res = await fetch(API_BASE + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mail, password })
  });
  const data = await res.json();
  if (!res.ok) throw data.message || "Login failed";
  setAuth(data);
  return data;
}

async function doRegister(userObj) {
  const res = await fetch(API_BASE + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userObj)
  });
  const data = await res.json();
  if (!res.ok) throw data.message || "Registration failed";
  setAuth(data);
  return data;
}

// ----- PRODUCT / API HELPERS -----
async function loadBrowseProducts() {
  const resp = await fetch(API_BASE + "/allprod", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  const data = await resp.json();
  if (!resp.ok || data.error) throw data.message || "Failed to load products";
  return data.details || [];
}

async function loadProductDetails(prodId) {
  const resp = await fetch(API_BASE + "/prodData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: prodId })
  });
  const data = await resp.json();
  if (!resp.ok || data.error) throw data.message || "Failed to load product";
  return data.details;
}

async function doSell(pdata) {
  const auth = getAuth();
  if (!auth?.user?.id) throw "Not authenticated";
  const resp = await fetch(API_BASE + "/sell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pdata, id: auth.user.id })
  });
  const data = await resp.json();
  if (!resp.ok || data.error) throw data.message || "Failed to list product";
  return data;
}

async function loadProfile() {
  const auth = getAuth();
  if (!auth?.user?.id) throw "Not authenticated";
  const resp = await fetch(API_BASE + "/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: auth.user.id })
  });
  const data = await resp.json();
  if (!resp.ok || data.error) throw data.message || "Failed to load profile";
  return data;
}

async function deleteMyProduct(pid) {
  const resp = await fetch(API_BASE + "/deletemyprod", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pid })
  });
  const data = await resp.json();
  if (!resp.ok || data.error) throw data.message || "Failed to delete";
  return data;
}

async function searchProductByName(searchval) {
  const resp = await fetch(API_BASE + "/searchproduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchval })
  });
  const data = await resp.json();
  if (!resp.ok || data.error) throw data.message || "Search failed";
  return data.mysearchdata || [];
}

// ----- UTILS -----
function requireAuthOrRedirect() {
  const auth = getAuth();
  if (!auth || !auth.user) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function parseQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// ----- EXPORTS -----
window.renderNav = renderNav;
window.doLogin = doLogin;
window.doRegister = doRegister;
window.loadBrowseProducts = loadBrowseProducts;
window.loadProductDetails = loadProductDetails;
window.doSell = doSell;
window.loadProfile = loadProfile;
window.deleteMyProduct = deleteMyProduct;
window.searchProductByName = searchProductByName;
window.requireAuthOrRedirect = requireAuthOrRedirect;
window.getAuth = getAuth;
window.parseQueryParam = parseQueryParam;
