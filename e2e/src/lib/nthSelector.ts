
export function NthSelector(selector: string, index: number): string {
    return `${selector}:nth-child(${index + 1})`;
}
