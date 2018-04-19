import saslprep from 'saslprep'
import md5 from 'md5'

export let RTCconfig = {
    iceServers: [
        // 5349
        {urls: 'turn:127.0.0.1:3478', username: 'mediacenter', credential: 'password'} // ,
    ]
}

export function onIceCandidateSuccess() {
    console.log('ICECandidate added')
}

export function onIceCandidateFailure(error) {
    console.log('Adding ICE Candidate failed with error:')
    console.log(error.toString())

    switch (error.errorCode) {
    case 401:
        console.log(error)
        const realm = 'mediacenter'
        // We are not properly authenticated
        const password = saslprep(RTCconfig.iceServers[0].credential)
        RTCconfig.iceServers[0].username = md5(
            `${RTCconfig.iceServers[0].username}:${realm}:${password}`
        )
        break
    }
}

export function handleIceCandidate(candidate, thisPeerConnection) {
    thisPeerConnection.addIceCandidate(candidate).then(
        onIceCandidateSuccess
    )
        .catch(onIceCandidateFailure)
}
