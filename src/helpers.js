export function matchAny(text, ...regexps) {
  if (regexps.some(regex => regex.test(text))) {
    return true
  }

  return false
}