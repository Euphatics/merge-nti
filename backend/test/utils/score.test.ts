
describe("Scores test", () => {

    test("Verifying valid scores", () => {
        expect(calculatePercentage(400, 500)).toBe(80);
    });

    test("Verifying zero marks", () => {
        expect(calculatePercentage(0, 500)).toBe(0);
    });

});