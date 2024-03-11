import { check } from 'k6';

export function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function checkSuccessRpcSchema(response) {
    let requestBody = JSON.parse(response.request.body);
    let methodName = requestBody.method;
    
    let isStatus200 = check(response, {
        [`${methodName} is status 200`]: (r) => r.status === 200,
    });
    
    let isSchemaValid = false;

    try {
        const parsedResponse = JSON.parse(response.body);
        isSchemaValid = check(parsedResponse, {
            [`${methodName} response has expected schema`]: (r) => {
                return r.hasOwnProperty('jsonrpc')
                    && r.hasOwnProperty('result')
                    && r.hasOwnProperty('id');
            },
        });
    } catch (err) {
        console.error("Failed to parse response:", response.body, err);
    }

    // if (!isStatus200 || !isSchemaValid) {
    //     console.
    //     console.error("Method: ", methodName);
    //     console.error("Request URL: ", response.url);
    //     console.error("Request Body: ", requestBody);
    //     console.error("Response Body: ", JSON.stringify(response.body));
    // }
}