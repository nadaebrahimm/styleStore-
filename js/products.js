// Product data - in a real application, this would come from a database or API
const products = [
    {
        id: 1,
        name: "Classic White T-shirt",
        price: 24.99,
        oldPrice: 29.99,
        image: "../assets/images/product1.jpg",
        category: "clothing",
        featured: true,
        description: "A comfortable classic white t-shirt made from 100% organic cotton. Perfect for casual wear."
    },
    {
        id: 2,
        name: "Blue Denim Jacket",
        price: 89.99,
        oldPrice: 109.99,
        image: "../assets/images/product2.jpg",
        category: "clothing",
        featured: true,
        description: "Stylish blue denim jacket with a modern fit. Great for layering in any season."
    },
    {
        id: 3,
        name: "Floral Summer Dress",
        price: 49.99,
        oldPrice: 59.99,
        image: "../assets/images/product3.jpg",
        category: "clothing",
        featured: true,
        description: "Beautiful floral summer dress with a flattering silhouette. Perfect for warm weather."
    },
    {
        id: 4,
        name: "Leather Handbag",
        price: 79.99,
        oldPrice: 99.99,
        image: "../assets/images/product4.jpg",
        category: "accessories",
        featured: true,
        description: "Elegant leather handbag with multiple compartments. Stylish and practical."
    },
    {
        id: 5,
        name: "Running Shoes",
        price: 119.99,
        oldPrice: 139.99,
        image: "../assets/images/product5.jpg",
        category: "shoes",
        featured: false,
        description: "High-performance running shoes with cushioned soles. Perfect for sports and casual wear."
    },
    {
        id: 6,
        name: "Gold Necklace",
        price: 149.99,
        oldPrice: 179.99,
        image: "../assets/images/product6.jpg",
        category: "accessories",
        featured: false,
        description: "Elegant gold-plated necklace with a delicate pendant. Adds a touch of sophistication to any outfit."
    },
    {
        id: 7,
        name: "Black Leather Jacket",
        price: 199.99,
        oldPrice: 249.99,
        image: "../assets/images/product7.jpg",
        category: "clothing",
        featured: false,
        description: "Classic black leather jacket with a fitted design. A timeless piece for any wardrobe."
    },
    {
        id: 8,
        name: "Patterned Scarf",
        price: 34.99,
        oldPrice: 44.99,
        image: "../assets/images/product8.jpg",
        category: "accessories",
        featured: false,
        description: "Soft, colorful patterned scarf. Versatile accessory for all seasons."
    }
];

// Function to display products
function displayProducts(productArray, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    productArray.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product';
        
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price}</span>
                    <span class="old-price">$${product.oldPrice}</span>
                </div>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        element.appendChild(productCard);
    });
    
    // Add event listeners to the Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Function to get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Function to filter products by category
function filterProductsByCategory(category) {
    if (!category || category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Function to search products
function searchProducts(query) {
    if (!query) return products;
    
    const searchTerms = query.toLowerCase().split(' ');
    return products.filter(product => {
        const productName = product.name.toLowerCase();
        const productDesc = product.description.toLowerCase();
        
        return searchTerms.some(term => 
            productName.includes(term) || productDesc.includes(term)
        );
    });
}

// Function to sort products
function sortProducts(productsArray, sortOption) {
    const productsCopy = [...productsArray];
    
    switch(sortOption) {
        case 'price-low':
            return productsCopy.sort((a, b) => a.price - b.price);
        case 'price-high':
            return productsCopy.sort((a, b) => b.price - a.price);
        case 'newest':
            // For demonstration, we'll just reverse the array
            return productsCopy.reverse();
        default:
            return productsCopy;
    }
}

// Function to get featured products
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

// Function for adding to cart (placeholder)
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;
    
    console.log(`Added ${quantity} x ${product.name} to cart`);
    
    // Update cart count for visual feedback
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        let currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + quantity;
    }
    
    // Show success message
    alert(`Added ${product.name} to your cart!`);
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the products page
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        // Initially show all products
        displayProducts(products, 'products-container');
        
        // Set up category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                const category = this.value;
                const filteredProducts = filterProductsByCategory(category);
                displayProducts(filteredProducts, 'products-container');
            });
        }
        
        // Set up sort filter
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                const sortOption = this.value;
                // Get current filtered products if category filter is active
                let currentProducts = products;
                if (categoryFilter && categoryFilter.value !== 'all') {
                    currentProducts = filterProductsByCategory(categoryFilter.value);
                }
                
                const sortedProducts = sortProducts(currentProducts, sortOption);
                displayProducts(sortedProducts, 'products-container');
            });
        }
        
        // Set up search functionality
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', function() {
                const query = searchInput.value.trim();
                const searchResults = searchProducts(query);
                displayProducts(searchResults, 'products-container');
            });
            
            // Also trigger search on Enter key
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const query = this.value.trim();
                    const searchResults = searchProducts(query);
                    displayProducts(searchResults, 'products-container');
                }
            });
        }
    }
    
    // Check if we're on the home page (for featured products)
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        displayProducts(getFeaturedProducts(), 'featured-products');
    }
});