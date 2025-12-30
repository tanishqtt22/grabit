async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        // Convert price to number for sorting
        return products.map(p => ({ ...p, price: parseFloat(p.price) }));
    } catch (error) {
        console.error("Could not fetch products:", error);
        return [];
    }
}

// --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${index * 100}ms`;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { rootMargin: '0px', threshold: 0.1 });

// --- RENDERING LOGIC ---
function renderProducts(productsToRender) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    const oldCards = document.querySelectorAll('.product-card');
    oldCards.forEach(card => observer.unobserve(card));

    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No products found. Try a different search or category.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-url', product.productUrl);

        const imageContainer = document.createElement('div');
        imageContainer.className = 'product-image-container';

        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title;
        image.className = 'product-image';
        imageContainer.appendChild(image);

        const info = document.createElement('div');
        info.className = 'product-info';

        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.title;

        const description = document.createElement('p');
        description.className = 'product-description';
        description.textContent = product.description;

        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = `${product.currency}${product.price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

        const buyButton = document.createElement('a');
        buyButton.href = product.productUrl;
        buyButton.target = '_blank';
        buyButton.rel = 'noopener noreferrer sponsored';
        buyButton.className = 'buy-button';
        buyButton.textContent = `View on ${product.vendor || 'Amazon'}`;

        info.appendChild(title);
        info.appendChild(description);
        info.appendChild(price);
        info.appendChild(buyButton);

        card.appendChild(imageContainer);
        card.appendChild(info);

        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                window.open(product.productUrl, '_blank', 'noopener,noreferrer');
            }
        });

        productGrid.appendChild(card);
        observer.observe(card);
    });
}

function applyFiltersAndSorting(allProducts, category, sort, searchTerm) {
    let filtered = [...allProducts];

    // Filter by category
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply sorting
    switch (sort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'default':
        default:
            filtered.sort((a, b) => a.id - b.id);
            break;
    }

    return filtered;
}

function setActive(selector, value) {
    const links = document.querySelectorAll(selector);
    const attribute = selector.includes('category') ? 'data-category' : 'data-sort';
    links.forEach(link => {
        if (link.getAttribute(attribute) === value) {
            link.classList.add('active-category'); // Re-use the same style for active state
        } else {
            link.classList.remove('active-category');
        }
    });
}

// --- MAIN EVENT LISTENER ---
document.addEventListener('DOMContentLoaded', async () => {
    const searchBar = document.getElementById('search-bar');
    const categoryLinks = document.querySelectorAll('[data-category]');
    const sortLinks = document.querySelectorAll('[data-sort]');
    const allProducts = await fetchProducts();
    
    let currentCategory = 'all';
    let currentSort = 'default';
    let currentSearch = '';

    const updateDisplay = () => {
        const productsToRender = applyFiltersAndSorting(allProducts, currentCategory, currentSort, currentSearch);
        renderProducts(productsToRender);
        setActive('[data-category]', currentCategory);
        setActive('[data-sort]', currentSort);
    };

    // Initial render
    updateDisplay();

    // Category filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = link.dataset.category;
            currentSearch = ''; // Reset search
            searchBar.value = '';
            updateDisplay();
        });
    });

    // Sorting
    sortLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentSort = link.dataset.sort;
            updateDisplay();
        });
    });

    // Search functionality
    searchBar.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        // Optional: Reset category when user types, or filter within the category.
        // For now, we filter within the currently selected category or all.
        updateDisplay();
    });
});
