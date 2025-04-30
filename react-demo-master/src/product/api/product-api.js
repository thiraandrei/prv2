import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    product: '/products'
};

// GET all products
function getProducts(callback) {
    let request = new Request(HOST.backend_api + endpoint.product, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

// GET product by name
function getProductById(name, callback) {
    let request = new Request(`${HOST.backend_api + endpoint.product}/${encodeURIComponent(name)}`, {
        method: 'GET'
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

// POST a new product
function postProduct(product, callback) {
    let request = new Request(HOST.backend_api + endpoint.product, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
    });
    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// PUT - update product by name
function updateProduct(product, callback) {
    const name = encodeURIComponent(product.name);
    let request = new Request(`${HOST.backend_api + endpoint.product}/${name}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
    });
    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// DELETE product by name
function deleteProduct(name, callback) {
    let request = new Request(`${HOST.backend_api + endpoint.product}/${encodeURIComponent(name)}`, {
        method: 'DELETE'
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getProducts,
    getProductById,
    postProduct,
    updateProduct,
    deleteProduct
};
