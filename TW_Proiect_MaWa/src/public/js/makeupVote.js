document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/makeup-produse');
    const products = await response.json();
    const productsDiv = document.getElementById('products');

    products.forEach(product => {
        const productDiv = document.createElement('div');
        const nume = product.nume.charAt(0).toUpperCase() + product.nume.slice(1);
        productDiv.className = 'articles-col';
        productDiv.innerHTML = `
            <img src="${product.imagine}" alt="${nume} - ${product.firma}">
            <h3>${nume}</h3>
            <p>${product.firma}</p>
            <p>Voturi: <span id="votes-${product.id}">${product.voturi}</span></p>
            <button class="vote-button" onclick="vote(${product.id})">Votează</button>
        `;
        productsDiv.appendChild(productDiv);
    });
});

async function vote(id) {
    const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });

    if (response.ok) {
        const result = await response.json();
        const voteCountSpan = document.getElementById(`votes-${id}`);
        voteCountSpan.textContent = parseInt(voteCountSpan.textContent) + 1;
    }
}
