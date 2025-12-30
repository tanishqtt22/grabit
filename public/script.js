async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Could not fetch products:", error);
        return []; // Return an empty array on error
    }
}

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

document.addEventListener('DOMContentLoaded', async () => {
    const searchBar = document.getElementById('search-bar');
    const allProducts = await fetchProducts();

    // Initial render of all products
    renderProducts(allProducts);

    // Add event listener for the search bar
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = allProducts.filter(product => 
                product.title.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });
    }
});
