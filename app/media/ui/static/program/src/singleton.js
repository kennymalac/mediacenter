export default function singleton(getStore, storeValue, typeCheck, create) {
    return new Promise((resolve, reject) => {
        const store = getStore()

        if (typeCheck(store[storeValue])) {
            return resolve(store[storeValue])
        }
        create().then((newValue) => {
            store[storeValue] = newValue
            return resolve(newValue)
        })
    })
}
