import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    user: '/users'
};

function getUsers(callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'GET',
    });

    console.log("GET: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function getUserByUsername(username, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + '/' + username, {
        method: 'GET',
    });

    console.log("GET by username: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function postUser(user, callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("POST: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function updateUser(username, user, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + '/' + username, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("PUT: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteUser(username, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + '/' + username, {
        method: 'DELETE',
    });

    console.log("DELETE: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getUsers,
    getUserByUsername,
    postUser,
    updateUser,
    deleteUser
};
