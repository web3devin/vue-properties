import {structure} from './../src/structure.js';

const schema = {
    name: 'string',
    age: ['integer', 'undefined']
}

describe('Structure Test', function () {

    it('Basic Structure', function () {
        // given
        const validator = structure(schema);

        // when
        const valid = validator({ name: 'Phil' });

        // then
        expect(valid).toBe(true);
    });

    it('Basic Structure with optional set', function () {
        // given
        const validator = structure(schema);

        // when
        const valid = validator({ name: 'Phil', age: 24 });

        // then
        expect(valid).toBe(true);
    });

    it('Additional property with option set to true', function () {
        // given
        const validator = structure(schema, { additionalProperties: true });

        // when
        const valid = validator({ name: 'Phil', age: 24, occupation: 'Salaryman' });

        // then
        expect(valid).toBe(true);
    });

    it('Basic Structure with invalid optional property', function () {
        // given
        const validator = structure(schema);

        // when
        const valid = validator({ name: 'Phil', age: 'old' });

        // then
        expect(valid).toBe(false);
    });

    it('Required Property not set', function () {
        // given
        const validator = structure(schema);

        // when
        const valid = validator({});

        // then
        expect(valid).toBe(false);
    });

    it('Additional Property with option set false', function () {
        // given
        const validator = structure(schema, {additionalProperties: false});

        // when
        const valid = validator({ name: 'Phil', age: 24, occupation: 'Salaryman' });

        // then
        expect(valid).toBe(true);
    });
});
