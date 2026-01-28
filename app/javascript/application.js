// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"


document.addEventListener("turbo:load", () => {
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
                productDiv.className = "border rounded-lg p-4 shadow hover:shadow-lg transition"

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
})

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
}