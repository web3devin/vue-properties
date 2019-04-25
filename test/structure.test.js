import {structure} from './../src/structure.js';

const schema = {
    name: 'string',
    age: 'integer'
}

describe('Structure Test', function () {

    it('Basic Strcture', function () {
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
        let valid = false
        try {
            valid = validator({ name: 'Phil', age: 'old' });
        } catch (e) {
            expect(e).toBe('The age property must be of integer type');
        }

        // then
        expect(valid).toBe(false);
    });

    it('Required Property not set', function () {
        // given
        const validator = structure(schema);

        // when
        let valid = false
        try {
            valid = validator({});
        } catch (e) {
            expect(e).toBe('The name property is required');
        }

        // then
        expect(valid).toBe(false);
    });

    it('Additional Property with option set false', function () {
        // given
        const validator = structure(schema, {additionalProperties: false});

        // when
        let valid = false
        try {
            valid = validator({ name: 'Phil', age: 24, occupation: 'Salaryman' });
        } catch (e) {
            expect(e).toBe('The occupation property must not exist');
        }

        // then
        expect(valid).toBe(true);
    });
});
