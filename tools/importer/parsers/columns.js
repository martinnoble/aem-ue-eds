/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block variant.
 * Base block: columns
 * Source: https://www.nationwide-intermediary.co.uk/
 * Generated: 2026-05-05
 *
 * Handles three source instances:
 * 1. .ImageAndArticle - image left, text/CTA right
 * 2. .ContentCardWithArticle - text links left, image+text right
 * 3. .NewsBanner - text/CTA left, image right
 *
 * Columns block (xwalk): No field hints required per hinting rules.
 * Each instance produces a 2-column layout with one content row.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which instance type we're dealing with
  const isImageAndArticle = element.classList.contains('ImageAndArticle');
  const isContentCardWithArticle = element.classList.contains('ContentCardWithArticle');
  const isNewsBanner = element.classList.contains('NewsBanner');

  if (isImageAndArticle) {
    // Instance 1: .ImageAndArticle
    // Layout: image on left, text content (heading, paragraphs, CTA) on right
    const image = element.querySelector('.ImageAndArticle-imageCard img, .ImageAndArticle-card-imgLeft img');
    const heading = element.querySelector('.ImageAndArticle-contentCard h2, .ImageAndArticle-contentCard h3');
    const textContainer = element.querySelector('.ImageAndArticle-contentCard-text');
    const paragraphs = textContainer
      ? Array.from(textContainer.querySelectorAll(':scope > p'))
      : Array.from(element.querySelectorAll('.ImageAndArticle-contentCard p'));
    const ctaLink = element.querySelector('.ImageAndArticle-contentCard a.Button, .ImageAndArticle-contentCard a[class*="Button"]');

    // Left cell: image
    const leftCell = [];
    if (image) leftCell.push(image);

    // Right cell: heading + paragraphs + CTA
    const rightCell = [];
    if (heading) rightCell.push(heading);
    // Add text paragraphs (excluding the one wrapping the CTA)
    paragraphs.forEach((p) => {
      const link = p.querySelector('a.Button, a[class*="Button"]');
      if (!link) {
        rightCell.push(p);
      }
    });
    if (ctaLink) rightCell.push(ctaLink);

    cells.push([leftCell, rightCell]);
  } else if (isContentCardWithArticle) {
    // Instance 2: .ContentCardWithArticle
    // Layout: text with links on left, image with text on right
    const heading = element.querySelector('.ContentCardWithArticle-contentCard h2, .ContentCardWithArticle-contentCard h3');
    const col1Links = element.querySelector('.ContentCardWithArticle-ContentCOL1');
    const col2Links = element.querySelector('.ContentCardWithArticle-ContentCOL2');
    const imageCard = element.querySelector('.ContentCardWithArticle-imageCard');
    const image = imageCard ? imageCard.querySelector('img') : null;
    const imageHeading = imageCard ? imageCard.querySelector('h3, h2') : null;
    const imageText = imageCard ? imageCard.querySelector('p') : null;
    const imageLink = imageCard ? imageCard.querySelector('a') : null;

    // Left cell: heading + link lists from both columns
    const leftCell = [];
    if (heading) leftCell.push(heading);
    if (col1Links) {
      const links = Array.from(col1Links.querySelectorAll('a'));
      links.forEach((link) => leftCell.push(link));
    }
    if (col2Links) {
      const links = Array.from(col2Links.querySelectorAll('a'));
      links.forEach((link) => leftCell.push(link));
    }

    // Right cell: image + heading + description + CTA
    const rightCell = [];
    if (image) rightCell.push(image);
    if (imageHeading) rightCell.push(imageHeading);
    if (imageText) rightCell.push(imageText);
    if (imageLink) rightCell.push(imageLink);

    cells.push([leftCell, rightCell]);
  } else if (isNewsBanner) {
    // Instance 3: .NewsBanner
    // Layout: text content (heading, description, CTA) on left, image on right
    const content = element.querySelector('.NewsBanner-content');
    const heading = content
      ? content.querySelector('h2, h3')
      : element.querySelector('.NewsBanner-card h2, .NewsBanner-card h3');
    const description = content
      ? content.querySelector('p')
      : element.querySelector('.NewsBanner-card p');
    const ctaLink = content
      ? content.querySelector('a.Button, a[class*="Button"]')
      : element.querySelector('.NewsBanner-card a.Button, .NewsBanner-card a[class*="Button"]');
    const image = element.querySelector('.NewsBanner-card > img, .NewsBanner-container img');

    // Left cell: heading + description + CTA
    const leftCell = [];
    if (heading) leftCell.push(heading);
    if (description) leftCell.push(description);
    if (ctaLink) leftCell.push(ctaLink);

    // Right cell: image
    const rightCell = [];
    if (image) rightCell.push(image);

    cells.push([leftCell, rightCell]);
  } else {
    // Fallback: generic two-column split
    // Try to find any logical left/right division
    const children = Array.from(element.children);
    const midpoint = Math.ceil(children.length / 2);
    const leftCell = children.slice(0, midpoint);
    const rightCell = children.slice(midpoint);
    cells.push([leftCell, rightCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
