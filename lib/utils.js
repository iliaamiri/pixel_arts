export function createBlankArray(number = 16) {
    return Array(number).fill(0).map(a => (Array(number).fill(0)))
}