import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    order: '/orders'
};

function getOrders(callback) {
    let request = new Request(HOST.backend_api + endpoint.order, {
        method: 'GET',
    });
    RestApiClient.performRequest(request, callback);
}

function getOrderById(id, callback){
    let request = new Request(HOST.backend_api + endpoint.order + '/' + id, {
        method: 'GET'
    });
    RestApiClient.performRequest(request, callback);
}

function postOrder(order, callback){
    let request = new Request(HOST.backend_api + endpoint.order, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    });
    RestApiClient.performRequest(request, callback);
}

function updateOrder(order, callback){
    let request = new Request(HOST.backend_api + endpoint.order + '/' + order.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    });
    RestApiClient.performRequest(request, callback);
}

function deleteOrder(id, callback){
    let request = new Request(HOST.backend_api + endpoint.order + '/' + id, {
        method: 'DELETE'
    });
    RestApiClient.performRequest(request, callback);
}

export {
    getOrders,
    getOrderById,
    postOrder,
    updateOrder,
    deleteOrder
};
