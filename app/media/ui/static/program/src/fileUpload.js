import {makeJsonRequest, jsonResponse} from "./httputil.js"

function futch(url, opts = {}, onProgress) {
    // This is a wrapper to XHR that behaves like the fetch() API
    // The fetch api cannot send Blobs as of now
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        for (var k in opts.headers || {}) {
            xhr.setRequestHeader(k, opts.headers[k])
        }
        xhr.onload = e => resolve(e.target.responseText)
        xhr.onerror = reject
        console.log('test', onProgress)
        if (onProgress) {
            xhr.upload.onprogress = onProgress
        }
        xhr.open(opts.method || 'get', url)
        xhr.send(opts.body)
    })
}

const onProgressEvent = async(event) => {
    console.log('defaultOnProgress', event)
    const val = event.loaded / event.total
    if (event.lengthComputable) {
        console.log('progress: ', val * 100)
    }
    return val
}

export default class uploader {

    config = {}

    constructor(config) {
        this.config = {...config}
        if (typeof this.config.baseUrl !== 'string' || this.config.baseUrl.length === 0) {
            throw new Error("baseUrl must be provided")
        }
        else if (this.config.baseUrl.slice(-1) !== '/') {
            this.config.baseUrl = `${this.config.baseUrl}/`
        }
    }

    async prepare(fileInfo, onProgress) {
        try {
            const resp = await makeJsonRequest(`prepare-upload/`, {
                method: "POST",
                authenticated: false,
                body: {
                    filename: fileInfo.name
                    // "content-type":
                }
            }, this.config.baseUrl).then(jsonResponse)

            console.log(resp)
            return resp
        }
        catch (e) {
            console.log(e)
        }
    }

    async add(fileInfo, onProgress = () => {}, onError = () => {}) {
        console.log(fileInfo)
        const sessionInfo = await this.prepare(fileInfo)

        try {
            const resp = await futch(`${this.config.baseUrl}upload-chunked/SESSION/${sessionInfo.id}`, {
                method: "POST",
                authenticated: false,
                body: fileInfo.file
            }, (progress) => {
                onProgressEvent(progress).then(onProgress)
            })

            console.log("Successful upload: ", resp)

            return JSON.parse(resp).url
        }
        catch (e) {
            console.log("Upload error: ", e)
            onError(e.data)
        }
    }

    async cancel() {
        // TODO
    }
}
