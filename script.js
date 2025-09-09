const all_plants_api = "https://openapi.programming-hero.com/api/plants";
const all_category_api = "https://openapi.programming-hero.com/api/categories";
const categoryContainer = document.getElementById("categories");
const treelist = document.getElementById("treelist");
const loading = document.getElementById("loading");
const cartlist = document.getElementById("cartlist");
const totalprice = document.getElementById("totalprice");

let cart = [];
let activecategory = "all";

// function 

// category loading 
async function loadCategories() {
    const res = await fetch(all_category_api);
    const data = await res.json();
    refreshCategories(data.categories);
}

function refreshCategories(categories) {
    const allBtn = document.createElement("button");
    allBtn.innerText = "All Trees";
    allBtn.className = "text-left px-3 py-2 rounded bg-green-600 text-white hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer";
    allBtn.addEventListener("click", () => {
        setActiveCategory("all", allBtn);
        loadTrees();
    });
    categoryContainer.appendChild(allBtn);
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.innerText = cat.category_name;
        btn.className = "text-left px-3 py-2 rounded hover:bg-green-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer";
        btn.addEventListener("click", () => {
            setActiveCategory(cat.id, btn);
            loadTrees(cat.id);
        });
        categoryContainer.appendChild(btn);
    });
}

function setActiveCategory(id, btn) {
    activecategory = id;

    document.querySelectorAll("#categories button").forEach(b =>
        b.classList.remove("bg-green-600", "text-white"));
    btn.classList.add("bg-green-600", "text-white");
}

// load plants 
async function loadTrees(categoryid = null) {
    treelist.innerHTML = "";
    loading.classList.remove("hidden");
    let url = "https://openapi.programming-hero.com/api/plants";
    if (categoryid && categoryid != "all") {
        url = `https://openapi.programming-hero.com/api/category/${categoryid}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    const plants = data.plants || data;
    refreshTrees(plants);
    loading.classList.add("hidden");
}

function refreshTrees(plants) {
    treelist.innerHTML = "";
    plants.forEach(tree => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-xl shadow flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer";
        card.innerHTML = `
          <div>
            <img src="${tree.image}" alt="${tree.name}" class="h-24 w-full object-cover rounded mb-2">
            <h3 class="font-bold cursor-pointer hover:text-green-600" onclick="loadTreeDetail(${tree.id})">${tree.name}</h3>
            <p class="text-sm text-gray-500">${tree.description?.slice(0, 40) || "No description"}...</p>
            
          </div>
          <div class="flex items-center justify-between mt-3 pb-5">
            <span class="inline-block mt-2 text-xs bg-[#DCFCE7] text-[#15803D] px-2 py-1 rounded-2xl">${tree.category || "Unknown"}</span>
            <span class="font-semibold">৳${tree.price || 0}</span>
          </div>
          <button class="bg-[#15803D] text-white px-3 py-1 rounded-2xl" onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price || 0})">Add to Cart</button>
        `;
        treelist.appendChild(card);
    });
}

async function loadTreeDetail(id) {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
        const data = await res.json();
        const plant = data.plants;
        if (!plant) {
            throw new Error("Plant data not found");
        }
        document.getElementById("modalTitle").innerText = plant.name;
        document.getElementById("modalDesc").innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded mb-3"/>
      <p>${plant.description || "No details available."}</p>
      <div class= "flex justify-between item-center"><p class="mt-2 font-semibold text-green-600">Category: ${plant.category || "Unknown"}</p>
      <p class="font-bold text-lg">৳${plant.price || "N/A"}</p>
      </div>
    `;
        document.getElementById("treemodal").classList.remove("hidden");

    } catch (error) {
        console.error("Error fetching details:", error);
        document.getElementById("modalDesc").innerText = "Failed to load tree details.";
        document.getElementById("treemodal").classList.remove("hidden");
    }
}

function openModal(title, desc) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDesc").innerText = desc;
    document.getElementById("treemodal").classList.remove("hidden");
}
function closeModal() {
    document.getElementById("treemodal").classList.add("hidden");
}

// cart 
function addToCart(id, name, price) {
    const oldcart = cart.find(item => item.id === id);
    if (oldcart) {
        oldcart.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    updateCart();
}
function updateCart() {
    cartlist.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-green-50 p-2 rounded";
        li.innerHTML = `
          <span>${item.name} (x${item.qty})</span>
          <button onclick="removeFromCart(${item.id})" class="text-red-500 font-bold">✕</button>
        `;
        cartlist.appendChild(li);
    });
    totalprice.innerText = "৳" + total;
}
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

loadCategories();
loadTrees();