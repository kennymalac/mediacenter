export function onIceCandidateSuccess() {
    console.log('ICECandidate added')
}

export function onIceCandidateFailure(error) {
    console.log('Adding ICE Candidate failed with error:')
    console.log(error.toString())
}

export function handleIceCandidate(candidate, thisPeerConnection) {
    thisPeerConnection.addIceCandidate.then(
        onIceCandidateSuccess,
        onIceCandidateFailure
    )
}
