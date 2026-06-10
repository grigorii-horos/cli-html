export const deepMerge = (base, override) => {
  if (!override || typeof override !== 'object') return base;
  if (!base || typeof base !== 'object') return override;

  const result = { ...base };
  for (const key of Object.keys(override)) {
    const val = override[key];
    if (val === null || val === undefined) continue;
    if (
      typeof val === 'object' &&
      !Array.isArray(val) &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(base[key], val);
    } else {
      result[key] = val;
    }
  }
  return result;
};
