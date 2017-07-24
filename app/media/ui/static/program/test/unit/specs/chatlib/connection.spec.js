import {WSConnection, RTCConnectionPool} from 'src/chatlib/display'

// describe('a WebSocket connection', () => {
//     it('should ', () => {
//         expect()
//             .to.equal('');
//     });
//     it('should ', () => {
//         expect()
//             .to.equal('');
//     });
// });

describe('RTCConnectionPool', () => {
    before(() => {
        let pool = new RTCConnectionPool()
        let peer = {id: 'p1'}
    })

    it('should store peer connections in a Map', () => {
        expect(pool.peerConnections)
            .to.be.instanceof(Map)
        expect(pool.peerConnections)
            .to.be.empty
    })

    it('can prepare connections', () => {
        const conn = pool.prepare(peer)
        expect(pool.peerConnections)
            .to.have.lengthOf(1)
        expect(pool.peerConnections[Symbol(peer.id)])
            .to.be.instanceof(RTCPeerConnection)
        expect(conn)
            .to.be.instanceof(RTCPeerConnection)

        pool.prepare({id: 'p2'})
        expect(pool.peerConnections[Symbol('p2')])
            .to.be.instanceof(RTCPeerConnection)
        expect(conn)
            .to.be.instanceof(RTCPeerConnection)
        expect(pool.peerConnections)
            .to.have.lengthOf(2)
    });

    it('can clear all connections', () => {
        pool.prepare(peer)
        pool.clear()
        expect(pool.peerConnections)
            .to.be.empty
    });
});
