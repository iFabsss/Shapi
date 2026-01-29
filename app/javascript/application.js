// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"


document.addEventListener("turbo:load", () => {
    initProducts()
    initAuthModal()
})

function initAuthModal() {
    const modal = document.getElementById("auth-modal");
    const openBtn = document.getElementById("open-auth-modal");
    const closeBtn = document.getElementById("close-auth-modal");

    const loginTab = document.getElementById("login-tab");
    const signupTab = document.getElementById("signup-tab");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (!modal || !openBtn) return;

    // Open modal
    openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    });

    // Close modal
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    });

    // Tabs
    loginTab.addEventListener("click", () => {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");

        loginTab.classList.add("border-b-2", "border-blue-500", "font-bold");
        signupTab.classList.remove("border-b-2", "border-blue-500", "font-bold");
    });

    signupTab.addEventListener("click", () => {
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");

        signupTab.classList.add("border-b-2", "border-blue-500", "font-bold");
        loginTab.classList.remove("border-b-2", "border-blue-500", "font-bold");
    });
}

function initProducts() {
    const productsGrid = document.getElementById("products-grid");
    const productsLoading = document.getElementById("products-loading");
    if (!productsGrid || !productsLoading) return;

    productsGrid.classList.add("opacity-0")

    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(products => {
            productsGrid.innerHTML = "" // Clear loading state if any

            products.forEach(product => {
                const shortDescription = truncateText(product.description, 80)

                const productDiv = document.createElement("div")
                productDiv.className = "border rounded-lg p-4 shadow hover:shadow-lg transition bg-amber-50 cursor-pointer h-full flex flex-col"

                productDiv.innerHTML = `
                    <div class="flex flex-col h-full">
                        <img src="${product.image}"
                            alt="${product.title}"
                            class="h-40 object-contain mb-4 mx-auto">

                        <h3 class="font-bold text-lg mb-1">
                        ${product.title}
                        </h3>

                        <p class="text-green-600 font-semibold mb-2">
                        $${product.price}
                        </p>

                        <p class="text-sm text-gray-700 mb-3">
                        ${shortDescription}
                        </p>

                        <div class="flex justify-between items-center text-sm mt-auto">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            ${product.category}
                        </span>

                        <span class="text-yellow-600 font-semibold">
                            ⭐ ${product.rating.rate} (${product.rating.count})
                        </span>
                        </div>
                    </div>
                    `

                productDiv.addEventListener("click", () => {
                    showProductDetails(product)
                })

                productsGrid.appendChild(productDiv)
            })
            const loadingDiv = document.getElementById("products-loading")

            loadingDiv.classList.add("hidden")
            productsGrid.classList.remove("opacity-0")

        })
        .catch(error => {
            console.error("Error loading products:", error)
            productsGrid.innerHTML = "<p class='text-red-500'>Failed to load products.</p>"
        })
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
}

function showProductDetails(product) {
    const productCard = document.createElement("div")
    productCard.className = "border rounded-lg p-4 shadow-lg max-w-md mx-auto nax-h-full bg-white z-20 relative"

    productCard.innerHTML = `
        <div class="flex flex-col">
            <img src="${product.image}"
                alt="${product.title}"
                class="h-60 object-contain mb-4 mx-auto">

            <h3 class="font-bold text-xl mb-2">
            ${product.title}
            </h3>

            <p class="text-green-600 font-semibold mb-2">
            $${product.price}
            </p>

            <p class="text-sm text-gray-700 mb-4">
            ${product.description}
            </p>

            <div class="flex justify-between items-center text-sm">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                ${product.category}
            </span>

            <span class="text-yellow-600 font-semibold">
                ⭐ ${product.rating.rate} (${product.rating.count})
            </span>
            </div>
        </div>

        
        `

    // Simple modal display
    const modalOverlay = document.createElement("div")
    modalOverlay.className = "fixed inset-0  flex items-center justify-center z-50"

    const modalBg = document.createElement("div")
    modalBg.className = "absolute inset-0 bg-black opacity-50 z-10"

    modalOverlay.appendChild(modalBg)
    modalOverlay.appendChild(productCard)



    modalBg.addEventListener("click", () => {
        document.body.removeChild(modalOverlay)
    })

    document.body.appendChild(modalOverlay)
}