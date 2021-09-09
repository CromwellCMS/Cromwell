import { handleBaseInput } from '../../src/helpers/base-queries';


describe('base-queries', () => {

    it('handleBaseInput', async () => {
        const ent: any = {}
        const input = {
            slug: "HELLO@world"
        }
        handleBaseInput(ent, input)

        expect(ent.slug).toEqual('hello-world');
    });
});


