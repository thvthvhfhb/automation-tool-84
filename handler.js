// @ts-check
/**
 * Handles user requests and responses.
 * @param {Object} request - The incoming request object.
 * @param {Object} response - The outgoing response object.
 * @returns {void}
 */
function handleRequest(request, response) {
    const { method, url } = request;
    /**
     * Logs the request method and URL.
     * @returns {void}
     */
    function logRequest() {
        console.log(`Request Method: ${method}, URL: ${url}`);
    }
    logRequest();

    switch (method) {
        case 'GET':
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('GET request received');
            break;
        case 'POST':
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({ message: 'POST request received' }));
            break;
        default:
            response.writeHead(405, {'Content-Type': 'text/plain'});
            response.end('Method Not Allowed');
            break;
    }
}