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
    allBtn.className = "text-left px-3 py-2 rounded bg-green-600 text-white";
    allBtn.addEventListener("click", () => {
        setActiveCategory("all", allBtn);
    });
    categoryContainer.appendChild(allBtn);
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.innerText = cat.category_name;
        btn.className = "text-left px-3 py-2 rounded hover:bg-green-200";
        btn.addEventListener("click", () => {
            setActiveCategory(cat.id, btn);
        });
        categoryContainer.appendChild(btn);
    });
}

function setActiveCategory(id, btn) {
    activecategory = id;
    document.querySelectorAll("#categories button");
    btn.classList.add("bg-green-600", "text-white");
}

loadCategories();