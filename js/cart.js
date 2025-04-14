// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Add to cart function
function addToCart(productId, quantity = 1) {
    // Find the product in our products array
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // Update quantity if product exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item if product doesn't exist in cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`Added ${product.name} to cart`);
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Update cart display if on cart page
    if (document.getElementById('cart-items')) {
        displayCart();
    }
}

// Update cart item quantity
function updateCartItemQuantity(productId, quantity) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        // Ensure quantity is at least 1
        cart[itemIndex].quantity = Math.max(1, quantity);
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display if on cart page
        if (document.getElementById('cart-items')) {
            displayCart();
        }
        
        // Update cart count
        updateCartCount();
    }
}

// Update cart count in header
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Display cart items on cart page
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyElement = document.getElementById('cart-empty');
    const cartItemsWrapper = document.getElementById('cart-items-container');
    
    if (!cartItemsContainer) return;
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartEmptyElement.style.display = 'block';
        cartItemsWrapper.style.display = 'none';
        return;
    }
    
    cartEmptyElement.style.display = 'none';
    cartItemsWrapper.style.display = 'block';
    
    // Clear existing cart items
    cartItemsContainer.innerHTML = '';
    
    // Calculate totals
    let subtotal = 0;
    
    // Add each item to the cart
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Product">
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Size: Medium</p>
                    </div>
                </div>
            </td>
            <td data-label="Price">$${item.price.toFixed(2)}</td>
            <td data-label="Quantity">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-btn increase" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td data-label="Subtotal">$${itemSubtotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        cartItemsContainer.appendChild(tr);
    });
    
    // Update summary
    const shipping = 5.00;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Show notification function
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);
    }
    
    // Update message and show notification
    notification.textContent = message;
    
    // Trigger reflow to ensure animation plays
    notification.offsetHeight;
    
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 3000);
}

// Initialize cart display if on cart page
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Display cart if on cart page
    if (document.getElementById('cart-items')) {
        displayCart();
    }
    
    // Populate cart summary on checkout page
    const checkoutSummary = document.getElementById('cart-summary');
    if (checkoutSummary) {
        populateCheckoutSummary();
    }
    
    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, you would process the payment here
            // For this demo, we'll just redirect to the thank you page
            window.location.href = 'thank-you.html';
            
            // Clear the cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    }
});

// Populate checkout summary
function populateCheckoutSummary() {
    const summaryElement = document.getElementById('cart-summary');
    if (!summaryElement) return;
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = 5.00;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    // Create summary HTML
    let summaryHTML = '<div class="checkout-items">';
    
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        summaryHTML += `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <div class="checkout-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="checkout-item-details">
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                </div>
                <div class="checkout-item-price">$${itemSubtotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    summaryHTML += '</div>';
    
    summaryHTML += `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (10%)</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
    
    summaryElement.innerHTML = summaryHTML;
}