export function getEnv(name: string, fallback = ''): string {
  const value = process.env[name];
  return value === undefined || value.trim() === '' ? fallback : value.trim();
}

export function getBooleanEnv(name: string, fallback = false): boolean {
  const value = getEnv(name);

  if (!value) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

export function getNumberEnv(name: string, fallback: number): number {
  const value = getEnv(name);

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getListEnv(name: string): string[] {
  return getEnv(name)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
