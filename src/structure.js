/* eslint-disable */
import { inEnum } from './validators'

const validation = {}
validation.defaults = {}
validation.messages = {}

function structure(schema, options) {
    if (typeof schema !== 'object' || isDate(schema)) throw new TypeError("Invalid argument: schema")
    if (['object', 'undefined'].indexOf(typeof options) === -1 || isDate(options)) throw new TypeError("Invalid argument: options")
    options = rollup(validation.defaults, options)
    return function(object) {
        let errors = []
        validate(object, schema, options, errors)
        if (errors.length && process.env.NODE_ENV !== 'production') {
            console.log(errors)
        }
        return !(errors.length)
    }
}

function rollup() {
    let obj = {}
    let sources = Array.prototype.slice.apply(arguments)
    while (sources.length) {
        const source = sources.shift()
        if (!source) continue

        if (typeof(source) !== 'object') {
            throw new TypeError('non-object passed to rollup')
        }

        for (const p in source) {
            if (source.hasOwnProperty(p)) {
                obj[p] = source[p]
            }
        }
    }
    return obj
}

function validate(object, schema, options, errors) {
    for (const prop in schema) {
        if (schema.hasOwnProperty(prop)) {
            validateProperty(object, object[prop], prop, schema[prop], options, errors)
        }
    }
}

function validateProperty(object, value, property, schema, options, errors) {
    // Check to see if the value is undefined, if it is, check that it isn't required in some way
    if (typeof value === 'undefined') {
        if (schema._required === true && schema._type !== 'any') {
            errors.push({
                attribute: 'required',
                property: property,
                expected: schema,
                actual: undefined
            })
            return
        } else if (schema._required !== true) {
            if (schema._required === 'trueIfMatch' && schema._matches) {
                for (const matchField in schema._matches) {
                    const filter = schema._matches[matchField] || null
                    const filters = isArray(filter) ? filter : [filter]
                    if (object[matchField] && filters.indexOf(object[matchField]) !== -1) {
                        errors.push({
                            attribute: 'required dependant',
                            property: property,
                            expected: schema,
                            actual: object[matchField]
                        })
                        return
                    }
                }
            } else if (schema._required && schema._required._matches) {
                for (const matchField in schema._required._matches) {
                    const filter = schema._required._matches[matchField] || null
                    const filters = isArray(filter) ? filter : [filter]
                    if (object[matchField] && filters.indexOf(object[matchField]) !== -1) {
                        errors.push({
                            attribute: 'required dependant',
                            property: property,
                            expected: schema,
                            actual: object[matchField]
                        })
                        return
                    }
                }
            }
            return
        }
    }

    // Check for any dependant properties and make it is explicitly check that it is true
    if (schema._dependsOn && object[schema._dependsOn] !== true) {
        errors.push({
            attribute: 'dependant',
            property: property,
            expected: schema._dependsOn,
            actual: object[schema._dependsOn]
        })
        return
    }

    // Check for any 'matches' properties and make sure the value is explicitly set
    // if (schema._matches) {
    //     for (const matchField in schema._matches) {
    //         const filter = schema._matches[matchField] || null
    //         const filters = isArray(filter) ? filter : [filter]
    //         if (object[matchField] && filters.indexOf(object[matchField]) === -1) {
    //             console.log(object[matchField], value)
    //             errors.push({
    //                 attribute: 'matching dependant',
    //                 property: property,
    //                 expected: filters,
    //                 actual: object[matchField]
    //             })
    //             return
    //         }
    //     }
    // }

    // Set Enum values if schema type is Enum
    let checkTypeOptions = {}
    if (schema._type === 'Enum') {
        checkTypeOptions.enum = schema._values
    }

    if (!checkType(value, schema._type, checkTypeOptions)) {
        errors.push({
            attribute: 'type',
            property: property,
            expected: schema._type,
            actual: typeof value
        })
        return
    }

    if (schema.data) {
        for (const prop in schema.data) {
            if (schema.data.hasOwnProperty(prop)) {
                if (value.length) {
                    for (let i = 0; i < value.length; i++) {
                        if (!checkType(value[i], schema._items)) {
                            errors.push({
                                attribute: 'type',
                                property: property,
                                expected: schema._items,
                                actual: typeof value[i]
                            })
                            return
                        }
                        validateProperty(value[i], value[i][prop], prop, schema.data[prop], options, errors)
                        if (errors.length) return
                    }
                } else if (schema.data[prop]._required && schema.data[prop]._type !== 'any') {
                    errors.push({
                        attribute: 'required',
                        property: property + '[0]',
                        expected: schema._items,
                        actual: undefined
                    })
                    return
                }
            }
        }
    }
    return
}

function checkType(value, type, options) {
    if (typeof type === 'undefined') return true
    const types = isArray(type) ? type : [type]
    for (let i = 0; i < types.length; i++) {
        type = types[i].toLowerCase().trim()
        switch (type) {
            case 'string':
                if (typeof value === 'string') return true
                break
            case 'array':
                if (isArray(value)) return true
                break
            case 'object':
                if (typeof value === 'object' && !isArray(value) && !isDate(value)) return true
                break
            case 'number':
                if (typeof value === 'number') return true
                break
            case 'integer':
                if (typeof value === 'number' && Math.floor(value) === value) return true
                break
            case 'null':
                if (value === null) return true
                break
            case 'boolean':
                if (typeof value === 'boolean') return true
                break
            case 'date':
                if (isDate(value)) return true
                break
            case 'enum':
                const validate = inEnum(...options.enum)
                if (validate(value)) return true
                break
            case 'any':
                if (typeof value !== 'undefined') return true
                break
        }
    }
    return false
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]'
}

function isDate(value) {
    return Object.prototype.toString.call(value) === '[object Date]'
}

export {
    structure
}
