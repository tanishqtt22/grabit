// --- PRODUCT DATA ---
// Replace this with your actual product data and affiliate links.
const products = [
    {
        id: 1,
        title: "Wireless Noise-Cancelling Headphones",
        description: "Immerse yourself in music with these high-fidelity, noise-cancelling headphones. Long-lasting battery and crystal-clear audio.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "$149.99",
        amazonLink: "https://amzn.to/45f06v4" // <-- Replace with your affiliate link
    },
    {
        id: 2,
        title: "Smartwatch with Fitness Tracker",
        description: "Stay connected and track your fitness goals. Monitors heart rate, sleep, and steps. Sleek design for any occasion.",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "$199.00",
        amazonLink: "https://www.amazon.com/s?k=smartwatch" // <-- Replace with your affiliate link
    },
    {
        id: 3,
        title: "Portable Bluetooth Speaker",
        description: "Take your music anywhere. This waterproof speaker delivers powerful sound and has a built-in microphone for calls.",
        image: "https://images.unsplash.com/photo-1589256469027-1c21a572d159?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "$79.50",
        amazonLink: "https://www.amazon.com/s?k=bluetooth+speaker" // <-- Replace with your affiliate link
    },
    {
        id: 4,
        title: "4K Action Camera",
        description: "Capture your adventures in stunning 4K. Waterproof, durable, and packed with features like image stabilization.",
        image: "https://images.unsplash.com/photo-1563298723-d07aa8228032?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "$250.00",
        amazonLink: "https://www.amazon.com/s?k=action+camera" // <-- Replace with your affiliate link
    },
    {
        id: 5,
        title: "Ergonomic Office Chair",
        description: "Improve your posture and comfort during long work hours. Fully adjustable with lumbar support and breathable mesh.",
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "$299.99",
        amazonLink: "https://www.amazon.com/s?k=office+chair" // <-- Replace with your affiliate link
    },
    {
        id: 6,
        title: "Single Serve Coffee Maker",
        description: "Brew your favorite coffee in minutes. Compact design is perfect for small spaces. Compatible with K-Cup pods.",
        image: "https://images.unsplash.com/photo-1622483758336-a8342a342413?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "$89.99",
        amazonLink: "https://www.amazon.com/s?k=coffee+maker" // <-- Replace with your affiliate link
    }
];

// --- CORE LOGIC ---

// Function to render products to the grid
function renderProducts(productsToRender) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear existing products

    productsToRender.forEach((product, index) => {
        // Create the main card element
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-amazon-link', product.amazonLink);
        
        // Staggered animation
        card.style.animationDelay = `${index * 0.1}s`;

        // Create the image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'product-image-container';

        // Create the image
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title;
        image.className = 'product-image';
        imageContainer.appendChild(image);

        // Create the info container
        const info = document.createElement('div');
        info.className = 'product-info';

        // Create the title
        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.title;

        // Create the description
        const description = document.createElement('p');
        description.className = 'product-description';
        description.textContent = product.description;
        
        // Create the price
        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = product.price;

        // Create the buy button
        const buyButton = document.createElement('a');
        buyButton.href = product.amazonLink;
        buyButton.target = '_blank'; // Open in new tab
        buyButton.rel = 'noopener noreferrer sponsored';
        buyButton.className = 'buy-button';
        buyButton.textContent = 'View on Amazon';

        // Assemble the card
        info.appendChild(title);
        info.appendChild(description);
        info.appendChild(price);
        info.appendChild(buyButton);
        
        card.appendChild(imageContainer);
        card.appendChild(info);

        // Add an event listener to the card itself
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                window.open(product.amazonLink, '_blank', 'noopener,noreferrer');
            }
        });

        // Add the fully constructed card to the grid
        productGrid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');

    // Initial render of all products
    renderProducts(products);

    // Add event listener for the search bar
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.title.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });
    }
});
