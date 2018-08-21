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
        return auth.authenticate(headers)
    }
    return headers
}

export function jsonResponse(response) {
    // TODO better error handling
    if (response.status >= 200 && response.status < 300) {
        return response.json()
    }
    else {
        const error = new Error(response.statusText)
        error.response = response
        error.data = response.json()
        console.log(error)
        throw error
    }
}

export function fetchAPI(uri, params, baseUrl = `${API_URL}/api/`) {
    if (params.queryParams) {
        uri += (uri.indexOf('?') === -1 ? '?' : '&') + queryParams(params.queryParams)
        delete params.queryParams
    }

    return fetch(`${baseUrl}${uri}`, params).then(async (response) => {
        if (response.status === 403 && params.headers['Authorization']) {
            // Token refresh and retry
            await auth.getToken(true)
            params.headers = auth.authenticate(params.headers)
            return await fetch(`${baseUrl}${uri}`, params)
        }
        return response
    })
}
