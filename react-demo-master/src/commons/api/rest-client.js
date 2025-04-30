// Funcție de utilitate internă pentru a parsa în siguranță JSON
async function safeJsonParse(response) {
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : {};
    } catch (e) {
        return { message: "Invalid JSON", raw: text };
    }
}

// Funcție principală care face request-ul
function performRequest(request, callback) {
    fetch(request)
        .then(async function (response) {
            const parsed = await safeJsonParse(response);
            if (response.ok) {
                callback(parsed, response.status, null);
            } else {
                callback(null, response.status, parsed);
            }
        })
        .catch(function (err) {
            // catch any other unexpected error, and set custom code for error = 1
            callback(null, 1, err);
        });
}

module.exports = {
    performRequest
};
