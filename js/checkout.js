// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // If cart is empty, redirect to products page
    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }
    
    // Display order summary
    displayOrderSummary();
    
    // Update cart count in the header
    updateCartCount();
    
    /**
     * Display order summary in the checkout page
     */
    function displayOrderSummary() {
        const orderItemsContainer = document.querySelector('.order-items');
        
        if (!orderItemsContainer) return;
        
        // Clear existing order items
        orderItemsContainer.innerHTML = '';
        
        // Add order items
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            orderItem.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <h3>${item.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.price.toFixed(2)}</p>
                </div>
                <div class="order-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            `;
            
            orderItemsContainer.appendChild(orderItem);
        });
        
        // Update order summary
        updateOrderSummary();
    }
    
    /**
     * Update the order summary (subtotal, tax, shipping, total)
     */
    function updateOrderSummary() {
        const subtotalElement = document.getElementById('order-subtotal');
        const taxElement = document.getElementById('order-tax');
        const shippingElement = document.getElementById('order-shipping');
        const totalElement = document.getElementById('order-total');
        
        if (!subtotalElement || !taxElement || !shippingElement || !totalElement) return;
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Calculate tax (assume 10%)
        const taxRate = 0.1;
        const tax = subtotal * taxRate;
        
        // Calculate shipping (free for orders over $50)
        const shipping = subtotal > 50 ? 0 : 10;
        
        // Calculate total
        const total = subtotal + tax + shipping;
        
        // Update elements
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    /**
     * Update cart count in header
     */
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => {
                return total + item.quantity;
            }, 0);
            cartCountElement.textContent = totalItems;
        }
    }
    
    /**
     * Handle form submission
     */
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(checkoutForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Validate form
            if (validateForm(formValues)) {
                // Process order (in a real application, this would send data to a server)
                processOrder(formValues);
            }
        });
    }
    
    /**
     * Validate form fields
     */
    function validateForm(formValues) {
        // Reset previous error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        let isValid = true;
        
        // Validate first name
        if (!formValues.firstName.trim()) {
            document.getElementById('firstName-error').textContent = 'First name is required';
            isValid = false;
        }
        
        // Validate last name
        if (!formValues.lastName.trim()) {
            document.getElementById('lastName-error').textContent = 'Last name is required';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues.email)) {
            document.getElementById('email-error').textContent = 'Valid email is required';
            isValid = false;
        }
        
        // Validate address
        if (!formValues.address.trim()) {
            document.getElementById('address-error').textContent = 'Address is required';
            isValid = false;
        }
        
        // Validate city
        if (!formValues.city.trim()) {
            document.getElementById('city-error').textContent = 'City is required';
            isValid = false;
        }
        
        // Validate state/province
        if (!formValues.state.trim()) {
            document.getElementById('state-error').textContent = 'State/Province is required';
            isValid = false;
        }
        
        // Validate zip/postal code
        if (!formValues.zip.trim()) {
            document.getElementById('zip-error').textContent = 'ZIP/Postal code is required';
            isValid = false;
        }
        
        // Validate payment method
        if (!formValues.paymentMethod) {
            document.getElementById('payment-error').textContent = 'Payment method is required';
            isValid = false;
        }
        
        // If credit card is selected, validate card details
        if (formValues.paymentMethod === 'credit') {
            // Validate card number (16 digits)
            const cardNumberRegex = /^\d{16}$/;
            if (!cardNumberRegex.test(formValues.cardNumber)) {
                document.getElementById('cardNumber-error').textContent = 'Valid 16-digit card number is required';
                isValid = false;
            }
            
            // Validate expiry date (MM/YY format)
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(formValues.expiry)) {
                document.getElementById('expiry-error').textContent = 'Valid expiry date (MM/YY) is required';
                isValid = false;
            } else {
                // Check if expired
                const [month, year] = formValues.expiry.split('/');
                const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
                const today = new Date();
                if (expiryDate < today) {
                    document.getElementById('expiry-error').textContent = 'Card has expired';
                    isValid = false;
                }
            }
            
            // Validate CVV (3 digits)
            const cvvRegex = /^\d{3}$/;
            if (!cvvRegex.test(formValues.cvv)) {
                document.getElementById('cvv-error').textContent = 'Valid 3-digit CVV is required';
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    /**
     * Process the order
     */
    function processOrder(formValues) {
        // Show loading indicator
        const submitBtn = document.querySelector('.place-order-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        // In a real application, this would send the order to a server
        // For this demo, we'll simulate a server request with setTimeout
        setTimeout(() => {
            // Create order object
            const order = {
                id: generateOrderId(),
                items: cart,
                customer: {
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    email: formValues.email,
                    address: formValues.address,
                    city: formValues.city,
                    state: formValues.state,
                    zip: formValues.zip,
                    country: formValues.country
                },
                paymentMethod: formValues.paymentMethod,
                subtotal: calculateSubtotal(),
                tax: calculateTax(),
                shipping: calculateShipping(),
                total: calculateTotal(),
                date: new Date().toISOString()
            };
            
            // Save order to localStorage (in a real app, this would be saved to a database)
            saveOrder(order);
            
            // Clear cart
            clearCart();
            
            // Redirect to order confirmation page
            window.location.href = `order-confirmation.html?orderId=${order.id}`;
        }, 1500);
    }
    
    /**
     * Generate a random order ID
     */
    function generateOrderId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    /**
     * Calculate subtotal
     */
    function calculateSubtotal() {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    /**
     * Calculate tax (10%)
     */
    function calculateTax() {
        return calculateSubtotal() * 0.1;
    }
    
    /**
     * Calculate shipping (free for orders over $50)
     */
    function calculateShipping() {
        return calculateSubtotal() > 50 ? 0 : 10;
    }
    
    /**
     * Calculate total
     */
    function calculateTotal() {
        return calculateSubtotal() + calculateTax() + calculateShipping();
    }
    
    /**
     * Save order to localStorage
     */
    function saveOrder(order) {
        // Get existing orders
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Add new order
        orders.push(order);
        
        // Save back to localStorage
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    /**
     * Clear cart
     */
    function clearCart() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Toggle payment method fields
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                const creditCardFields = document.querySelector('.credit-card-fields');
                if (this.value === 'credit' && creditCardFields) {
                    creditCardFields.style.display = 'block';
                } else if (creditCardFields) {
                    creditCardFields.style.display = 'none';
                }
            });
        });
    }
    
    // Format credit card number with spaces
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 16 digits
            value = value.substring(0, 16);
            
            // Update input value
            this.value = value;
        });
    }
    
    // Format expiry date (MM/YY)
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add slash after first 2 digits
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            // Update input value
            this.value = value;
        });
    }
});