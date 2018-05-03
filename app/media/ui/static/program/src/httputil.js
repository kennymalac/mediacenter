import {API_URL} from 'config.js'
import auth from "auth.js"

export const defaultJsonHeaders = {
    "Content-Type": "application/json"
}

export function makeJsonRequest(uri, params, baseUrl) {
    const {method, body} = params
    return fetchAPI(uri, {
        method: method,
        headers: makeHeaders(defaultJsonHeaders),
        body: JSON.stringify(body)
    }, baseUrl)
}

export function makeHeaders(headers, needsAuthentication = true) {
    if (needsAuthentication) {
        auth.authenticate(headers)
    }
    return headers
}

export function jsonResponse(response) {
    // TODO better error handling
    if (response.status >= 200 && response.status < 300) {
        return response.json()
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function fetchAPI(uri, params, baseUrl = `${API_URL}/api/`) {
    return fetch(`${baseUrl}${uri}`, params)
}
