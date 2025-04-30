import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    discount: "/discount-codes"
};

// Get all discount codes
function getDiscounts(callback) {
    let request = new Request(HOST.backend_api + endpoint.discount, {
        method: 'GET'
    });
    console.log("GET: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// Get a discount code by name
function getDiscountByName(name, callback) {
    let request = new Request(`${HOST.backend_api}${endpoint.discount}/${name}`, {
        method: 'GET'
    });
    console.log("GET BY NAME: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// Create a new discount code
function postDiscount(discount, callback) {
    let request = new Request(HOST.backend_api + endpoint.discount, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discount)
    });
    console.log("POST: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// Update discount code by name
function updateDiscount(name, discount, callback) {
    let request = new Request(`${HOST.backend_api}${endpoint.discount}/${name}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discount)
    });
    console.log("PUT: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// Delete a discount code by name
function deleteDiscount(name, callback) {
    let request = new Request(`${HOST.backend_api}${endpoint.discount}/${name}`, {
        method: 'DELETE'
    });
    console.log("DELETE: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getDiscounts,
    getDiscountByName,
    postDiscount,
    updateDiscount,
    deleteDiscount
};
