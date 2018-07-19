export const serializeIds = function(values) {
    return values.map((val) => { return val.id })
}

export const serializeForms = function(values) {
    return values.map((val) => { return val.getForm() })
}

export function serializeContentItem(form) {
    // NOTE needs visibility here
    return {id: form.content_item.id, description: form.content_item.description, title: form.content_item.title, interests: serializeIds(form.content_item.interests), places: serializeIds(form.content_item.places), content_type: form.content_item.content_type.id, owner: form.content_item.owner.id}
}
