export function calculatePercentage(obtained: number, total: number): number {
    if (total <= 0) {
        throw new Error("Total marks must be greater than 0");
    }

    return (obtained / total) * 100;
}