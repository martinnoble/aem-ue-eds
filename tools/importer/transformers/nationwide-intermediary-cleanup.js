/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide Intermediary cleanup.
 * Removes non-authorable site chrome (header, footer, cookie consent).
 * All selectors validated from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (found: <div id="onetrust-consent-sdk">)
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable header (found: <header class="Header">)
    // Remove non-authorable footer (found: <footer class="Footer">)
    WebImporter.DOMUtils.remove(element, ['header.Header', 'footer.Footer', 'noscript', 'link', 'iframe']);
  }
}
