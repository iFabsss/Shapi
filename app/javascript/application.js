// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"


document.addEventListener("turbo:load", () => {
    initProducts()
    initAuthModal()
    initCart()
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
                productDiv.className = "border border-red-200 rounded-lg p-4 shadow hover:shadow-lg transition bg-amber-50 cursor-pointer h-full flex flex-col"

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

            <div class="mt-4 flex justify-center items-center space-x-2">
                <div id="quantity-section" class="mt-4 flex items-center space-x-2">
                    <label for="quantity" class="font-semibold">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" value="1" min="1"
                        class="border rounded w-16 px-2 py-1">
                </div>

                <button id="add-to-cart-btn"
                    class="mt-4 secondary-btn-color text-white px-4 py-2 rounded  transition self-center">
                    Add to Cart
                </button>
            </div>
        </div>
        `


    function addToCart() {
        const quantityInput = productCard.querySelector("#quantity")
        const quantity = parseInt(quantityInput.value) || 1

        const token = document.querySelector('meta[name="csrf-token"]').content

        fetch("/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
                "Accept": "application/json"
            },
            body: JSON.stringify({
                order: {
                    product_name: product.title,
                    price: product.price,
                    quantity: quantity,
                    img_src: product.image
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Added "${product.title}" to cart!`)
                } else {
                    alert("Failed to add to cart: " + data.errors.join(", "))
                }
            })
            .catch(error => {
                console.error("Add to cart error:", error)
                alert("Something went wrong adding to cart.")
            })
    }


    const addToCartBtn = productCard.querySelector("#add-to-cart-btn")
    addToCartBtn.addEventListener("click", addToCart)


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

function initCart() {
    const cartGrid = document.getElementById("cart-grid");
    const cartLoading = document.getElementById("cart-loading");
    if (!cartGrid || !cartLoading) return;

    cartGrid.classList.add("opacity-0")
    cartGrid.innerHTML = "" // Clear previous content

    console.log("Fetching cart data...", "/orders/cart");

    fetch("/orders/cart", {
        method: "GET",
        headers: { "Accept": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.orders.forEach(order => {
                    const orderDiv = document.createElement("div");
                    orderDiv.className = "border border-red-200 rounded-lg p-4 shadow bg-amber-50 h-full flex flex-col";

                    const imgUrl = order.img_src || "/fallback-image.png"; // fallback

                    orderDiv.innerHTML = `
                        <div class="flex h-full items-center gap-4">
                            <div class="w-full h-24 flex-1 items-center justify-center flex">
                                <img src="${imgUrl}"
                                    alt="${order.product_name}"
                                    class="max-h-full object-contain">
                            </div>

                            <h3 class="font-bold text-lg flex-3">
                                ${order.product_name}
                            </h3>

                            <div class="flex-1 flex gap-2 justify-end items-center">
                                <button id="delete-btn" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition cursor-pointer">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                

                                <p class="text-gray-400 font-semibold text-right">
                                    $${order.price}
                                </p>

                                <p class="text-gray-600 font-semibold">
                                    X
                                </p>

                                <input id="order-quantity" name="order-quantity" type="number" value="${order.quantity}" min="1"
                                    class="border rounded w-16 px-2 py-1">

                                <p id="order-total" class="text-green-600 font-semibold min-w-fit">
                                    = $${(order.price * order.quantity).toFixed(2)}
                                </p>

                                <button id="checkout-btn" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition cursor-pointer">
                                    Checkout
                                </button>
                            </div>
                        </div>
                    `;

                    const deleteBtn = orderDiv.querySelector("#delete-btn");
                    deleteBtn.addEventListener("click", () => {
                        const token = document.querySelector('meta[name="csrf-token"]').content;

                        fetch(`/orders/${order.id}`, {
                            method: "DELETE",
                            headers: {
                                "X-CSRF-Token": token,
                                "Accept": "application/json"
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    alert(`Removed "${order.product_name}" from cart.`);
                                    orderDiv.remove();
                                } else {
                                    alert("Failed to remove item: " + data.errors.join(", "));
                                }
                            })
                            .catch(error => {
                                console.error("Delete order error:", error);
                                alert("Something went wrong removing the item.");
                            });
                    });

                    const quantityInput = orderDiv.querySelector("#order-quantity");
                    quantityInput.addEventListener("change", () => {
                        let newQuantity = parseInt(quantityInput.value);
                        if (isNaN(newQuantity) || newQuantity < 1) {
                            newQuantity = 1;
                            quantityInput.value = newQuantity;
                        }

                        const token = document.querySelector('meta[name="csrf-token"]').content;

                        fetch(`/orders/${order.id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRF-Token": token,
                                "Accept": "application/json"
                            },
                            body: JSON.stringify({
                                order: { quantity: newQuantity }
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    console.log(`Updated quantity for "${order.product_name}" to ${newQuantity}.`);
                                    const orderTotal = orderDiv.querySelector("#order-total");
                                    orderTotal.textContent = `= $${(order.price * newQuantity).toFixed(2)}`;
                                    // Optionally update the total price display here
                                } else {
                                    alert("Failed to update quantity: " + data.errors.join(", "));
                                }
                            })
                            .catch(error => {
                                console.error("Update quantity error:", error);
                                alert("Something went wrong updating the quantity.");
                            });
                    });

                    const checkoutBtn = orderDiv.querySelector("#checkout-btn");
                    checkoutBtn.addEventListener("click", () => {
                        alert(`Proceeding to checkout for "${order.product_name}". (Functionality not implemented)`);
                    });

                    cartGrid.appendChild(orderDiv);
                });



            } else {
                cartGrid.innerHTML = "<p class='text-gray-600'>Your cart is empty.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching cart:", error);
            cartGrid.innerHTML = "<p class='text-gray-600'>Error loading cart.</p>";
        })
        .finally(() => {
            cartLoading.classList.add("hidden");
            cartGrid.classList.remove("opacity-0");
        });
}
