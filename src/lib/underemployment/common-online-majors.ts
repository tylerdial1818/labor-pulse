export const COMMON_ONLINE_MAJOR_NAMES = [
  "Accounting",
  "Business Administration",
  "Communications",
  "Computer Science",
  "Criminal Justice",
  "Early Childhood Education",
  "Education",
  "Finance",
  "Health Services",
  "Information Systems",
  "Information Technology",
  "Management",
  "Marketing",
  "Nursing",
  "Psychology",
  "Social Work"
] as const;

export function isCommonOnlineMajor(name: string) {
  const normalized = name.trim().toLowerCase();
  return COMMON_ONLINE_MAJOR_NAMES.some((major) => major.toLowerCase() === normalized);
}
