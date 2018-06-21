import moment from 'moment'

export function momentDate(input) {
    if (input === null) {
        return {}
    }
    return moment(input)
}

export const visibilityChoices = {
    '0': 'Public',
    '1': 'Unlisted',
    '9': 'Private'
}

export function choice(input, typeMapping) {
    return { text: typeMapping[input], value: input }
}

export function modelInstance(ModelType, input, collections = {}) {
    return new ModelType(input, collections)
}
