document.addEventListener('DOMContentLoaded', async () => {
    
    const response = await fetch('/api/clasament');
    const products = await response.json();
    const productsDiv = document.getElementById('clasament');
    let pozitie = 0;
    products.forEach(product => {
        const productDiv = document.createElement('tbody');
        pozitie++;
        const nume = product.nume.charAt(0).toUpperCase() + product.nume.slice(1);
        productDiv.innerHTML = `
            <tr>
                <td>${pozitie}</td>
                <td><img src="${product.imagine}" alt="${nume} - ${product.firma}" height="50"></td>
                <td>${nume}</td>
                <td>${product.firma}</td>
                <td>${product.voturi}</td>
            </tr>
        `;
        productsDiv.appendChild(productDiv);
    });
});
