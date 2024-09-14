function getProducts() {
    let products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    let products = getProducts();
    const searchQuery = document.getElementById('searchProduct').value.toLowerCase();
    products = products.filter(product => product.name.toLowerCase().includes(searchQuery));

    const filterCategory = document.getElementById('filterCategory').value;
    if (filterCategory !== 'all') {
        products = products.filter(product => product.category === filterCategory);
    }
    const sortPrice = document.getElementById('sortPrice').value;
    if (sortPrice === 'low-high') {
        products.sort((a, b) => a.price - b.price);
    } else if (sortPrice === 'high-low') {
        products.sort((a, b) => b.price - a.price);
    }

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td><img src="${product.image}" class="product-img" alt="Product Image"></td>
            <td>${product.category}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Delete</button>
                <button class="btn btn-success btn-sm" onclick="addToCart(${index})">Buy</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').value;
    const productId = document.getElementById('productId').value;

    let products = getProducts();


    if (productId === '') {
        const newProduct = { name: productName, price: productPrice, image: productImage, category: productCategory };
        products.push(newProduct);
    } else {
        products[productId] = { name: productName, price: productPrice, image: productImage, category: productCategory };
        document.getElementById('productId').value = '';
        document.getElementById('saveBtn').textContent = 'Add Product';
    }

    saveProducts(products);
    displayProducts();
    document.getElementById('productForm').reset();
});

function editProduct(index) {
    const products = getProducts();
    const product = products[index];

    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productId').value = index;
    document.getElementById('saveBtn').textContent = 'Update Product';

    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = product.image;
    imagePreview.style.display = 'block';
}

function deleteProduct(index) {
    let products = getProducts();
    products.splice(index, 1);
    saveProducts(products);
    displayProducts();
}

let cart = [];

function addToCart(index) {
    const products = getProducts();
    const product = products[index];
    cart.push(product);
    displayCart();
}
function displayCart() {
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    cartList.innerHTML = '';

    let total = 0;
    cart.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" class="product-img" alt="Product Image"></td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
        `;
        cartList.appendChild(row);
        total += parseFloat(product.price);
    });

    cartTotal.textContent = total.toFixed(2);
}

document.getElementById('productImage').addEventListener('input', function() {
    const imageUrl = this.value;
    const imagePreview = document.getElementById('imagePreview');
    if (imageUrl) {
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
    } else {
        imagePreview.style.display = 'none';
    }
});

document.getElementById('searchProduct').addEventListener('input', displayProducts);
document.getElementById('sortPrice').addEventListener('change', displayProducts);
document.getElementById('filterCategory').addEventListener('change', displayProducts);

document.addEventListener('DOMContentLoaded', displayProducts);