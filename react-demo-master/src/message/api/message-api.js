import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    message: '/messages'
};

// Fetch all messages
function getMessages(callback) {
    let request = new Request(HOST.backend_api + endpoint.message, {
        method: 'GET',
    });

    console.log("Fetching messages from: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// Send a new message
function postMessage(message, callback) {
    let request = new Request(HOST.backend_api + endpoint.message, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
    });

    console.log("Sending message to: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// Delete message by ID
function deleteMessage(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.message + '/' + id, {
        method: 'DELETE'
    });

    console.log("Deleting message from: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getMessages,
    postMessage,
    deleteMessage
};
