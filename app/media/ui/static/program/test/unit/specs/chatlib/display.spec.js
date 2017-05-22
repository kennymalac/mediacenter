import {Chat, ChatRoom} from 'src/chatlib/display'

describe('a Chat as a representation', () => {
    let chat = Chat();

    it('should create a new connection', () => {
        expect(typeof(chat.connection))
            .to.equal("RTCConnection");
    });

    it('should initialize an empty set of peers', () => {
        expect(typeof(chat.peers))
            .to.equal(typeof(Set()));
        expect(chat.peers.length)
            .to.equal(0);
    });
    /* it("should use the user's default stream options", () => {
        
     });*/

    it('can create an offer to a peer', () => {
        let peer = {
            id: '',
            'STUN': ''
        };
        let offer = chat.offer(peer);
        expect()
    });

    it('can update peers on request', () => {
        chat.updatePeers();
        expect(chat.peers.length)
            .to.equal(1);
    });
});

describe('a ChatRoom displaying a Chat', () => {
    it('can show a single user', () => {
        // test solo layout mutator
    });
    it('can show a couple users', () => {
        // test line layout mutator
    });
    it('can show a few users', () => {
        // test triangle layout mutator
    });
    it('can show several users', () => {
        // test block layout mutator
    });
});
