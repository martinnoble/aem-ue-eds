/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards variant.
 * Base block: cards
 * Source: https://www.nationwide-intermediary.co.uk/
 * Instances: .PerformanceCards, .ContentCardsWithImage
 * Generated: 2026-05-05
 *
 * Handles two source patterns:
 * 1. PerformanceCards - stats cards with titles, detail text, and figure values (no images)
 * 2. ContentCardsWithImage - content cards with images, headings, descriptions, and CTAs
 *
 * UE Model fields per card: image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which instance type we are parsing
  const isPerformanceCards = element.classList.contains('PerformanceCards');
  const isContentCards = element.classList.contains('ContentCardsWithImage');

  if (isPerformanceCards) {
    // Instance 1: PerformanceCards - stats cards
    const cards = element.querySelectorAll('.PerformanceCards-card');

    cards.forEach((card) => {
      // Image cell - empty for performance cards
      const imageCell = document.createDocumentFragment();

      // Text cell - combine title, detail, and figures into richtext
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:text '));

      const title = card.querySelector('h3');
      if (title) {
        textCell.appendChild(title.cloneNode(true));
      }

      const detail = card.querySelector('.PerformanceCards-card-detail');
      if (detail) {
        const p = document.createElement('p');
        p.textContent = detail.textContent.trim();
        textCell.appendChild(p);
      }

      // Extract figure data
      const figures = card.querySelectorAll('.PerformanceCards-card-figure');
      figures.forEach((figure) => {
        const figHeading = figure.querySelector('h4');
        const figValue = figure.querySelector('.PerformanceCards-card-figure-value');
        const figUnit = figure.querySelector('.PerformanceCards-card-figure-unit');

        if (figHeading) {
          const h4 = document.createElement('h4');
          h4.textContent = figHeading.textContent.trim();
          textCell.appendChild(h4);
        }
        if (figValue || figUnit) {
          const p = document.createElement('p');
          const valueText = figValue ? figValue.textContent.trim() : '';
          const unitText = figUnit ? figUnit.textContent.trim() : '';
          p.textContent = unitText ? `${valueText} ${unitText}`.trim() : valueText;
          textCell.appendChild(p);
        }
      });

      // Extract footer link if present
      const footerLink = card.querySelector('.PerformanceCards-card-footer a');
      if (footerLink) {
        const p = document.createElement('p');
        p.appendChild(footerLink.cloneNode(true));
        textCell.appendChild(p);
      }

      cells.push([imageCell, textCell]);
    });
  } else if (isContentCards) {
    // Instance 2: ContentCardsWithImage - cards with images and CTAs
    const containers = element.querySelectorAll('.ContentCardsWithImage-container');

    containers.forEach((container) => {
      // Image cell
      const imageCell = document.createDocumentFragment();
      const img = container.querySelector(':scope > img, :scope img');
      if (img) {
        imageCell.appendChild(document.createComment(' field:image '));
        imageCell.appendChild(img.cloneNode(true));
      }

      // Text cell - heading, description, CTA
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:text '));

      const heading = container.querySelector('.whiteOverlap h2, .ContentCardsWithImage-card h2');
      if (heading) {
        textCell.appendChild(heading.cloneNode(true));
      }

      const description = container.querySelector('.imageCardContent p:not(:last-child), .imageCardContent p:first-child');
      if (description) {
        textCell.appendChild(description.cloneNode(true));
      }

      const ctaLink = container.querySelector('.imageCardContent a.Button, .imageCardContent a');
      if (ctaLink) {
        const p = document.createElement('p');
        p.appendChild(ctaLink.cloneNode(true));
        textCell.appendChild(p);
      }

      cells.push([imageCell, textCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
