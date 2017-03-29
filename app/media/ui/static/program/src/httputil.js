function jsonResponse(response) {
    // TODO better error handling
    if (response.status >= 200 && response.status < 300) {
        return response.json()
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export {jsonResponse}
