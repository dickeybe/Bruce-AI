// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.querySelector('.cart-count');
    const checkoutButton = document.querySelector('.checkout-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const ctaButton = document.querySelector('.cta-button');
    const contactForm = document.getElementById('contact-form');
    
    // Product data
    const products = [
        { id: 1, name: 'Tyrannosaurus Rex', price: 24.99, image: 'https://via.placeholder.com/300x200?text=T-Rex' },
        { id: 2, name: 'Triceratops', price: 19.99, image: 'https://via.placeholder.com/300x200?text=Triceratops' },
        { id: 3, name: 'Velociraptor', price: 18.99, image: 'https://via.placeholder.com/300x200?text=Velociraptor' },
        { id: 4, name: 'Stegosaurus', price: 21.99, image: 'https://via.placeholder.com/300x200?text=Stegosaurus' },
        { id: 5, name: 'Brachiosaurus', price: 27.99, image: 'https://via.placeholder.com/300x200?text=Brachiosaurus' },
        { id: 6, name: 'Pteranodon', price: 22.99, image: 'https://via.placeholder.com/300x200?text=Pteranodon' }
    ];
    
    // Cart array to store items
    let cart = [];
    
    // Open cart modal
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when cart is open
    });
    
    // Close cart modal
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
    
    // Close cart when clicking outside the cart content
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = parseInt(productCard.dataset.id);
            const product = products.find(p => p.id === productId);
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            // Update cart UI
            updateCart();
            
            // Show notification
            showNotification(`${product.name} added to cart!`);
        });
    });
    
    // CTA button scrolls to products
    ctaButton.addEventListener('click', function() {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            showNotification('Message sent successfully! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Checkout button
    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        // In a real application, you would redirect to a checkout page
        showNotification('Proceeding to checkout...');
        
        // For demo purposes, we'll just clear the cart
        setTimeout(() => {
            cart = [];
            updateCart();
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            showNotification('Thank you for your purchase!');
        }, 1500);
    });
    
    // Update cart UI
    function updateCart() {
        // Clear cart items
        cartItems.innerHTML = '';
        
        // If cart is empty
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotalPrice.textContent = '$0.00';
            cartCount.textContent = '0';
            return;
        }
        
        // Calculate total
        let total = 0;
        let itemCount = 0;
        
        // Add items to cart
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <span class="remove-item" data-id="${item.id}">🗑️</span>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // Update total and count
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = itemCount.toString();
        
        // Add event listeners to quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                decreaseQuantity(id);
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                increaseQuantity(id);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                removeItem(id);
            });
        });
    }
    
    // Increase item quantity
    function increaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity++;
            updateCart();
        }
    }
    
    // Decrease item quantity
    function decreaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity--;
            if (item.quantity <= 0) {
                removeItem(id);
            } else {
                updateCart();
            }
        }
    }
    
    // Remove item from cart
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            transition: bottom 0.3s ease-in-out;
        }
        
        .notification.show {
            bottom: 20px;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize cart
    updateCart();
    
    // Smooth scroll for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
});
