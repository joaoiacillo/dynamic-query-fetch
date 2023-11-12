require("../lib/index");

describe("Initial testing", () => {
    test("it should return null", () => {
        expect(fetch.create()).toBeNull();
    });
});
