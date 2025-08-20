import { generateSlug } from "@/lib/utils";

describe('gnerateSlug', () => {
    it('should return a string of length 7', () => {
        const slug = generateSlug();
        expect(typeof slug).toBe('string');
        expect(slug.length).toBe(7);
    });

    it('should only alphanumeric characters', () => {
        const slug = generateSlug();
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        expect(alphanumericRegex.test(slug)).toBe(true);
    });

    it('should generate different slugs on subsequent calls', () => {
        const slug1 = generateSlug();
        const slug2 = generateSlug();
        expect(slug1).not.toBe(slug2);
    })

})