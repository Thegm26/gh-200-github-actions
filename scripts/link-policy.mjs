export function isIllustrativeTemplateUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'github.com' && /^\/OWNER\/REPO(?:\/|$)/i.test(parsed.pathname);
  } catch {
    return false;
  }
}
