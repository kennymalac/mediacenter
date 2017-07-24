import SmartPager from 'src/pager'

const createFakeMediaItem = () => {
    return {
        src: faker.image.imageUrl(),
        owner: {},
        id: faker.random.number(1,10000),
        description: faker.lorem.sentence()
    }
}

describe('DoublyLinkedAccessor', () => {
    before(() => {
        
    })
})

describe('SmartPager', () => {
    const mediaItems = Array(6).fill().map((_, i) => createFakeMediaItem())
    before(() => {
        // Default to a non-circular doubly-linked list
        let pager = new SmartPager(mediaItems, false, false)
    })
    // NOTE might want to benchmark&refine this data structure getting into 30,000+ node territory
    it('should doubly-link nodes on instantiation', () => {

        // Starts at index 0

    })

    it('should have configurable circular list behavior', () => {
        // Test one-sided circular lists
        let pagerOnlyFront = new SmartPager(mediaItems, true, false)
        let pagerOnlyBack  = new SmartPager(mediaItems, false, true)
        // Test circular list
        let pagerCircular  = new SmartPager(mediaItems, true, true)
    })

    if ('should', () => {
        
    })
})
