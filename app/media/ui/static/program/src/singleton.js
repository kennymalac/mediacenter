export default async function singleton(getStore, storeValue, typeCheck, create) {
    const store = getStore()

    if (typeCheck(store[storeValue])) {
        return store[storeValue]
    }
    else if (store[storeValue] instanceof Promise) {
        return await store[storeValue]
    }

    store[storeValue] = create()
    store[storeValue] = await store[storeValue]
    return store[storeValue]
}
