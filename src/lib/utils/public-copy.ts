export function normalizePublicCopy(value: string) {
  return value.replaceAll("—", ",").replaceAll(";", ".");
}
