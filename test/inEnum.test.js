import {inEnum} from './../src/validators.js';

describe('Validators Test', function () {

    it('Should be inEnum()', function () {
        // given
        const validator = inEnum('hello', 'hi');

        // when
        const valid = validator('hello');

        // then
        expect(valid).toBe(true);
    });

    it('Should not be inEnum()', function () {
        // given
        const validator = inEnum('hello', 'hi');

        // when
        const valid = validator('welcome');

        // then
        expect(valid).toBe(false);
    });

    it('Should not be inEnum()', function () {
        // given
        const validator = inEnum('hello', 'hi');

        // when
        const valid = validator(123);

        // then
        expect(valid).toBe(false);
    });
});
