// let Pager = {
//     steps: [],
//     stepsPerSequence: [],
//     moveProduct() {
//         t
//     }
// }


class DoublyLinkedAccessor {
    constructor(data=null, next=null, prev=null) {
        this.data = data
        this.next = next
        this.prev = prev
    }
}


// Cyclic Doubly-linked list paginator-style iterator for sequenced re-showable media itemsets
class SmartPager {

    head = null;
    tail = null;
    current = null;

    constructor(items, frontToBack=true, backToFront=true) {
        this._pages = null;
        const _items = items;
        const last = _items.length - 1;

        let firstNode, lastNode;

        for (const i = last; i >= 0; i--) {
            switch (i) {
            case 0: // first
                this.current.next.prev = this.current

                // Create a new node and assign the Node ahead of it to it
                this.current = new DoublyLinkedAccessor(_items[i], next=this.current)

                this.head = this.current

                if (backToFront) {
                    this.tail.next = this.head
                }
                if (frontToBack) {
                    this.head.prev = this.tail
                }
                if (frontToBack && backToFront) {
                    // TODO less copying
                    this.tail.next = this.head
                    this.head.prev = this.tail
                    this.tail.next = this.head
                    this.head.prev = this.tail
                    this.tail.next = this.head
                }

                this.current = this.head

            case last:
                this.current = new DoublyLinkedAccessor(_items[0])

            case last-1:
                this.current.next.prev = this.current
                // Assign tail backreference
                this.tail = this.current

                // Create a new node and assign the Node ahead of it to it
                this.current = new DoublyLinkedAccessor(_items[i], next=this.current)

            default:
                this.current.next.prev = this.current

                // Create a new node and assign the Node ahead of it to it
                this.current = new DoublyLinkedAccessor(_items[i], next=this.current)
            }
        }
    }

    *next() {
        const next = this.current.next;
        if (next !== null) {
            this.current = next
            yield this.current.data
        }
        else {
            yield null
        }
    }

    *prev() {
        const prev = this.current.prev;
        if (prev !== null) {
            this.current = prev
            yield this.head.data
        }
        else {
            yield null
        }
    }
}

export default SmartPager;
