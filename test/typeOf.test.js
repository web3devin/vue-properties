import {typeOf} from './../src/validators.js';

describe('Validators Test', function () {

    it('Should be typeOf()', function () {
        // given
        const validator = typeOf('boolean');

        // when
        const valid = validator(true);

        // then
        expect(valid).toBe(true);
    });

    it('Should be typeOf()', function () {
        // given
        const validator = typeOf('boolean', 'undefined');

        // when
        const valid = validator();

        // then
        expect(valid).toBe(true);
    });

    it('Should not be typeOf()', function () {
        // given
        const validator = typeOf('boolean');

        // when
        const valid = validator('welcome');

        // then
        expect(valid).toBe(false);
    });

    it('Should not be typeOf()', function () {
        // given
        const validator = typeOf('boolean');

        // when
        const valid = validator();

        // then
        expect(valid).toBe(false);
    });
});
