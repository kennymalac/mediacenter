import {API_URL} from 'config.js'
import {auth} from "auth.js"

export const defaultJsonHeaders = {
    "Content-Type": "application/json"
}

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
}

export function makeJsonRequest(uri, params, baseUrl) {
    const {method, body, authenticated, queryParams} = params
    const needsAuth = authenticated === undefined ? true : authenticated

    const _params = {
        method: method,
        headers: makeHeaders(defaultJsonHeaders, needsAuth)
    }
    if (queryParams !== undefined) {
        _params.queryParams = queryParams
    }
    if (body !== undefined) {
        _params.body = JSON.stringify(body)
    }

    return fetchAPI(uri, _params, baseUrl)
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
        console.log(error)
        throw error
    }
}

export function fetchAPI(uri, params, baseUrl = `${API_URL}/api/`) {
    if (params.queryParams) {
        uri += (uri.indexOf('?') === -1 ? '?' : '&') + queryParams(params.queryParams)
        delete params.queryParams
    }

    return fetch(`${baseUrl}${uri}`, params)
}
