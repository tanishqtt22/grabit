import * as THREE from 'three';

// --- 1. 3D SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// 3D Object
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({ color: 0xffa500, wireframe: true });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(pointLight, ambientLight);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.001;
    torusKnot.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();


// --- 2. PRODUCT DATA & LOGIC ---

async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const products = await response.json();
        return products.map(p => ({ ...p, price: parseFloat(p.price) }));
    } catch (error) {
        console.error("Could not fetch products:", error);
        return [];
    }
}

function renderProducts(productsToRender) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-results" style="color: #a3a3a3; text-align: center;">No products found.</p>';
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
        price.textContent = `${product.currency || '₹'}${product.price.toLocaleString('en-IN')}`;

        const buyButton = document.createElement('a');
        buyButton.href = product.productUrl;
        buyButton.target = '_blank';
        buyButton.rel = 'noopener noreferrer sponsored';
        buyButton.className = 'buy-button';
        buyButton.textContent = `View on ${product.vendor || 'Store'}`;

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
    });
}

function applyFiltersAndSorting(allProducts, category, sort, searchTerm) {
    let filtered = [...allProducts];

    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

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
            link.classList.add('active-category');
        } else {
            link.classList.remove('active-category');
        }
    });
}

// --- 3. SCROLL & INTERACTION HANDLERS ---

// Scroll handler for 3D animation
function handleScroll3D() {
    const t = document.body.getBoundingClientRect().top;
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.0075;
    torusKnot.rotation.z += 0.005;

    camera.position.z = t * -0.01 + 30;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}
document.body.onscroll = handleScroll3D;
handleScroll3D();


// --- 4. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
    // --- Product Logic Init ---
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

    updateDisplay(); // Initial render

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = link.dataset.category;
            currentSearch = '';
            searchBar.value = '';
            updateDisplay();
        });
    });

    sortLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentSort = link.dataset.sort;
            updateDisplay();
        });
    });

    searchBar.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        updateDisplay();
    });

    // --- Window Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    });
});
