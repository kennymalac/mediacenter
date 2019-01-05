import moment from 'moment'
import geojsonify from 'geoposition-to-geojson'

export function momentDate(input) {
    if (input === null) {
        return {}
    }
    return moment(input)
}

export function geoJSON(input) {
    // SRID=4326;POINT (long lat)
    const geo = input.slice(input.indexOf('(') + 1, input.indexOf(')')).split(" ")
    return geojsonify({ coords: { longitude: geo[0], latitude: geo[1] } }).geometry
}

export const visibilityChoices = {
    '0': 'Public',
    '1': 'Unlisted',
    '9': 'Private'
}

export const frequencyChoices = {
    'I': 'instantly',
    'D': 'daily',
    'W': 'weekly'
}

export function choice(input, typeMapping) {
    if (typeof input === 'string') {
        return { text: typeMapping[input], value: input }
    }
    return input
}

export function modelInstance(ModelType, input, collections = {}) {
    return new ModelType(input, collections)
}
