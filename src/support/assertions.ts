import { expect } from 'chai';

export async function expectTextToContain(
  actualTextPromise: Promise<string>,
  expectedText: string,
): Promise<void> {
  const actualText = await actualTextPromise;
  expect(actualText).to.contain(expectedText);
}
