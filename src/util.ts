export function classify(string: string): string {
    return string.replace(' ', '-').toLowerCase();
}
