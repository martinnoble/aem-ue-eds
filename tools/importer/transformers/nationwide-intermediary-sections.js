/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide Intermediary sections.
 * Runs in beforeTransform to flatten nested section containers and insert
 * <hr> section breaks as direct children of main BEFORE parsers run.
 *
 * Target sections:
 * 1. Hero (dark-blue) - .Hero.Hero-Theme--NEL
 * 2. Service Levels + Interest Only (white) - .PerformanceCards, .ImageAndArticle
 * 3. Quick Links (dark-blue) - .ContentCardWithArticle
 * 4. Content Cards + News Banner (dark-blue) - .ContentCardsWithImage, .NewsBanner
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;

  const { document } = payload;
  const main = element;

  // Find key content blocks
  const hero = main.querySelector('.Hero.Hero-Theme--NEL');
  const perfCards = main.querySelector('.PerformanceCards');
  const imageArticle = main.querySelector('.ImageAndArticle');
  const quickLinksContent = main.querySelector('.ContentCardWithArticle');
  const contentCardsWrapper = main.querySelector('.ContentCardsWithImage');
  const newsBanner = main.querySelector('.NewsBanner');

  if (!hero) return;

  // Build new flat structure
  const fragment = document.createDocumentFragment();

  // Section 1: Hero (dark-blue)
  fragment.appendChild(hero);
  const meta1 = document.createElement('table');
  meta1.innerHTML = '<tr><th colspan="2">Section Metadata</th></tr><tr><td>style</td><td>dark-blue</td></tr>';
  fragment.appendChild(meta1);
  fragment.appendChild(document.createElement('hr'));

  // Section 2: Service Levels + Interest Only (white - no style)
  // Extract the section title (h2 + p) that sits inside .serviceCardsTitle
  if (perfCards) {
    const serviceTitle = perfCards.querySelector('.serviceCardsTitle');
    if (serviceTitle) {
      const h2 = serviceTitle.querySelector('h2');
      const p = serviceTitle.querySelector('p');
      if (h2) fragment.appendChild(h2);
      if (p) fragment.appendChild(p);
    }
    fragment.appendChild(perfCards);
  }
  if (imageArticle) fragment.appendChild(imageArticle);
  fragment.appendChild(document.createElement('hr'));

  // Section 3: Quick Links (light blue background)
  if (quickLinksContent) fragment.appendChild(quickLinksContent);
  const meta2 = document.createElement('table');
  meta2.innerHTML = '<tr><th colspan="2">Section Metadata</th></tr><tr><td>style</td><td>light</td></tr>';
  fragment.appendChild(meta2);
  fragment.appendChild(document.createElement('hr'));

  // Section 4: Content Cards (white - no style)
  if (contentCardsWrapper) fragment.appendChild(contentCardsWrapper);
  fragment.appendChild(document.createElement('hr'));

  // Section 5: News Banner (light blue background)
  if (newsBanner) fragment.appendChild(newsBanner);
  const meta3 = document.createElement('table');
  meta3.innerHTML = '<tr><th colspan="2">Section Metadata</th></tr><tr><td>style</td><td>light</td></tr>';
  fragment.appendChild(meta3);

  // Replace main content
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  main.appendChild(fragment);
}
