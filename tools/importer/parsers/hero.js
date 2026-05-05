/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero variant.
 * Base block: hero
 * Source selector: .Hero.Hero-Theme--NEL
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Generated: 2026-05-05
 */
export default function parse(element, { document }) {
  // Background image is applied via CSS background-image / data-background-url on hidden inputs
  // Priority: desktop input, then the Hero-background div's inline style, then any img fallback
  let bgImage = null;
  const desktopInput = element.querySelector('input.desktopBackground[data-background-url], input.monitorBackground[data-background-url]');
  if (desktopInput) {
    const imageUrl = desktopInput.getAttribute('data-background-url');
    if (imageUrl) {
      bgImage = document.createElement('img');
      bgImage.src = imageUrl;
      bgImage.alt = '';
    }
  }
  // Fallback: check for inline style background-image on Hero-background div
  if (!bgImage) {
    const bgDiv = element.querySelector('.Hero-background, [class*="Hero-background"]');
    if (bgDiv) {
      const style = bgDiv.getAttribute('style') || '';
      const urlMatch = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
      if (urlMatch) {
        bgImage = document.createElement('img');
        bgImage.src = urlMatch[1];
        bgImage.alt = '';
      }
    }
  }
  // Fallback: direct img element
  if (!bgImage) {
    bgImage = element.querySelector('.Hero-background img, [class*="Hero-background"] img, :scope > img');
  }

  // Extract heading (h1 primary, fallback to h2/h3)
  const heading = element.querySelector('.Hero-card h1, .Hero-card h2, .Hero-card h3, h1, h2');

  // Extract description paragraph (direct paragraph not containing links)
  const heroCard = element.querySelector('.Hero-card, .Hero-content, [class*="Hero-card"]');
  let description = null;
  if (heroCard) {
    const paragraphs = heroCard.querySelectorAll(':scope > p');
    for (const p of paragraphs) {
      // Description paragraph is one that does not solely contain a link/button
      if (!p.querySelector('a.Button, a.button, a[class*="Button"]')) {
        description = p;
        break;
      }
    }
  }

  // Extract CTA link(s)
  const ctaLinks = Array.from(
    element.querySelectorAll('.Hero-card a.Button, .Hero-card a[class*="Button"], .Hero-card a.button, a.Button--primary')
  );

  // Build cells matching block library structure:
  // Row 1 (auto): block name
  // Row 2: background image (field: image)
  // Row 3: richtext content - heading, description, CTA (field: text)
  const cells = [];

  // Row 2: Image cell with field hint
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (bgImage) {
    imageCell.appendChild(bgImage);
  }
  cells.push([imageCell]);

  // Row 3: Text/richtext cell with field hint
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) {
    textCell.appendChild(heading);
  }
  if (description) {
    textCell.appendChild(description);
  }
  if (ctaLinks.length > 0) {
    const ctaContainer = document.createElement('p');
    ctaLinks.forEach((link) => {
      ctaContainer.appendChild(link);
    });
    textCell.appendChild(ctaContainer);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
