/* eslint-disable */
/* global WebImporter */

import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';

import cleanupTransformer from './transformers/nationwide-intermediary-cleanup.js';
import sectionsTransformer from './transformers/nationwide-intermediary-sections.js';

const parsers = {
  'hero': heroParser,
  'cards': cardsParser,
  'columns': columnsParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Nationwide Intermediary homepage - main landing page with hero, navigation, product information, and contact details',
  urls: [
    'https://www.nationwide-intermediary.co.uk/'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.Hero.Hero-Theme--NEL']
    },
    {
      name: 'cards',
      instances: ['.PerformanceCards', '.ContentCardsWithImage']
    },
    {
      name: 'columns',
      instances: ['.ImageAndArticle', '.ContentCardWithArticle', '.NewsBanner']
    }
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero Banner',
      selector: 'section.o-Container:first-of-type',
      style: 'dark-blue',
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-service-levels',
      name: 'Service Levels',
      selector: '.PerformanceCards',
      style: null,
      blocks: ['cards'],
      defaultContent: ['.serviceCardsTitle h2', '.serviceCardsTitle p']
    },
    {
      id: 'section-interest-only',
      name: 'Interest Only Promo',
      selector: '.ImageAndArticle',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-quick-links',
      name: 'Quick Links with Calculator',
      selector: '.o-Container--background.primaryBackground',
      style: 'dark-blue',
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-content-cards',
      name: 'Content Cards',
      selector: '.ContentCardsWithImage',
      style: null,
      blocks: ['cards'],
      defaultContent: []
    },
    {
      id: 'section-news-banner',
      name: 'News Banner',
      selector: '.NewsBanner',
      style: 'dark-blue',
      blocks: ['columns'],
      defaultContent: []
    }
  ]
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
