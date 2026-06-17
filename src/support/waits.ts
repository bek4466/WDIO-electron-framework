export const defaultTimeout = Number(process.env.WAIT_TIMEOUT_MS ?? 10000);

export type WaitOptions = {
  timeout?: number;
  timeoutMsg?: string;
};
