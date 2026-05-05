/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    let bgImage = null;
    const desktopInput = element.querySelector("input.desktopBackground[data-background-url], input.monitorBackground[data-background-url]");
    if (desktopInput) {
      const imageUrl = desktopInput.getAttribute("data-background-url");
      if (imageUrl) {
        bgImage = document.createElement("img");
        bgImage.src = imageUrl;
        bgImage.alt = "";
      }
    }
    if (!bgImage) {
      const bgDiv = element.querySelector('.Hero-background, [class*="Hero-background"]');
      if (bgDiv) {
        const style = bgDiv.getAttribute("style") || "";
        const urlMatch = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
        if (urlMatch) {
          bgImage = document.createElement("img");
          bgImage.src = urlMatch[1];
          bgImage.alt = "";
        }
      }
    }
    if (!bgImage) {
      bgImage = element.querySelector('.Hero-background img, [class*="Hero-background"] img, :scope > img');
    }
    const heading = element.querySelector(".Hero-card h1, .Hero-card h2, .Hero-card h3, h1, h2");
    const heroCard = element.querySelector('.Hero-card, .Hero-content, [class*="Hero-card"]');
    let description = null;
    if (heroCard) {
      const paragraphs = heroCard.querySelectorAll(":scope > p");
      for (const p of paragraphs) {
        if (!p.querySelector('a.Button, a.button, a[class*="Button"]')) {
          description = p;
          break;
        }
      }
    }
    const ctaLinks = Array.from(
      element.querySelectorAll('.Hero-card a.Button, .Hero-card a[class*="Button"], .Hero-card a.button, a.Button--primary')
    );
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (bgImage) {
      imageCell.appendChild(bgImage);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) {
      textCell.appendChild(heading);
    }
    if (description) {
      textCell.appendChild(description);
    }
    if (ctaLinks.length > 0) {
      const ctaContainer = document.createElement("p");
      ctaLinks.forEach((link) => {
        ctaContainer.appendChild(link);
      });
      textCell.appendChild(ctaContainer);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    const isPerformanceCards = element.classList.contains("PerformanceCards");
    const isContentCards = element.classList.contains("ContentCardsWithImage");
    if (isPerformanceCards) {
      const cards = element.querySelectorAll(".PerformanceCards-card");
      cards.forEach((card) => {
        const imageCell = document.createDocumentFragment();
        const textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(" field:text "));
        const title = card.querySelector("h3");
        if (title) {
          textCell.appendChild(title.cloneNode(true));
        }
        const detail = card.querySelector(".PerformanceCards-card-detail");
        if (detail) {
          const p = document.createElement("p");
          p.textContent = detail.textContent.trim();
          textCell.appendChild(p);
        }
        const figures = card.querySelectorAll(".PerformanceCards-card-figure");
        figures.forEach((figure) => {
          const figHeading = figure.querySelector("h4");
          const figValue = figure.querySelector(".PerformanceCards-card-figure-value");
          const figUnit = figure.querySelector(".PerformanceCards-card-figure-unit");
          if (figHeading) {
            const h4 = document.createElement("h4");
            h4.textContent = figHeading.textContent.trim();
            textCell.appendChild(h4);
          }
          if (figValue || figUnit) {
            const p = document.createElement("p");
            const valueText = figValue ? figValue.textContent.trim() : "";
            const unitText = figUnit ? figUnit.textContent.trim() : "";
            p.textContent = unitText ? `${valueText} ${unitText}`.trim() : valueText;
            textCell.appendChild(p);
          }
        });
        const footerLink = card.querySelector(".PerformanceCards-card-footer a");
        if (footerLink) {
          const p = document.createElement("p");
          p.appendChild(footerLink.cloneNode(true));
          textCell.appendChild(p);
        }
        cells.push([imageCell, textCell]);
      });
    } else if (isContentCards) {
      const containers = element.querySelectorAll(".ContentCardsWithImage-container");
      containers.forEach((container) => {
        const imageCell = document.createDocumentFragment();
        const img = container.querySelector(":scope > img, :scope img");
        if (img) {
          imageCell.appendChild(document.createComment(" field:image "));
          imageCell.appendChild(img.cloneNode(true));
        }
        const textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(" field:text "));
        const heading = container.querySelector(".whiteOverlap h2, .ContentCardsWithImage-card h2");
        if (heading) {
          textCell.appendChild(heading.cloneNode(true));
        }
        const description = container.querySelector(".imageCardContent p:not(:last-child), .imageCardContent p:first-child");
        if (description) {
          textCell.appendChild(description.cloneNode(true));
        }
        const ctaLink = container.querySelector(".imageCardContent a.Button, .imageCardContent a");
        if (ctaLink) {
          const p = document.createElement("p");
          p.appendChild(ctaLink.cloneNode(true));
          textCell.appendChild(p);
        }
        cells.push([imageCell, textCell]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const cells = [];
    const isImageAndArticle = element.classList.contains("ImageAndArticle");
    const isContentCardWithArticle = element.classList.contains("ContentCardWithArticle");
    const isNewsBanner = element.classList.contains("NewsBanner");
    if (isImageAndArticle) {
      const image = element.querySelector(".ImageAndArticle-imageCard img, .ImageAndArticle-card-imgLeft img");
      const heading = element.querySelector(".ImageAndArticle-contentCard h2, .ImageAndArticle-contentCard h3");
      const textContainer = element.querySelector(".ImageAndArticle-contentCard-text");
      const paragraphs = textContainer ? Array.from(textContainer.querySelectorAll(":scope > p")) : Array.from(element.querySelectorAll(".ImageAndArticle-contentCard p"));
      const ctaLink = element.querySelector('.ImageAndArticle-contentCard a.Button, .ImageAndArticle-contentCard a[class*="Button"]');
      const leftCell = [];
      if (image) leftCell.push(image);
      const rightCell = [];
      if (heading) rightCell.push(heading);
      paragraphs.forEach((p) => {
        const link = p.querySelector('a.Button, a[class*="Button"]');
        if (!link) {
          rightCell.push(p);
        }
      });
      if (ctaLink) rightCell.push(ctaLink);
      cells.push([leftCell, rightCell]);
    } else if (isContentCardWithArticle) {
      const heading = element.querySelector(".ContentCardWithArticle-contentCard h2, .ContentCardWithArticle-contentCard h3");
      const col1Links = element.querySelector(".ContentCardWithArticle-ContentCOL1");
      const col2Links = element.querySelector(".ContentCardWithArticle-ContentCOL2");
      const imageCard = element.querySelector(".ContentCardWithArticle-imageCard");
      const image = imageCard ? imageCard.querySelector("img") : null;
      const imageHeading = imageCard ? imageCard.querySelector("h3, h2") : null;
      const imageText = imageCard ? imageCard.querySelector("p") : null;
      const imageLink = imageCard ? imageCard.querySelector("a") : null;
      const leftCell = [];
      if (heading) leftCell.push(heading);
      if (col1Links) {
        const links = Array.from(col1Links.querySelectorAll("a"));
        links.forEach((link) => leftCell.push(link));
      }
      if (col2Links) {
        const links = Array.from(col2Links.querySelectorAll("a"));
        links.forEach((link) => leftCell.push(link));
      }
      const rightCell = [];
      if (image) rightCell.push(image);
      if (imageHeading) rightCell.push(imageHeading);
      if (imageText) rightCell.push(imageText);
      if (imageLink) rightCell.push(imageLink);
      cells.push([leftCell, rightCell]);
    } else if (isNewsBanner) {
      const content = element.querySelector(".NewsBanner-content");
      const heading = content ? content.querySelector("h2, h3") : element.querySelector(".NewsBanner-card h2, .NewsBanner-card h3");
      const description = content ? content.querySelector("p") : element.querySelector(".NewsBanner-card p");
      const ctaLink = content ? content.querySelector('a.Button, a[class*="Button"]') : element.querySelector('.NewsBanner-card a.Button, .NewsBanner-card a[class*="Button"]');
      const image = element.querySelector(".NewsBanner-card > img, .NewsBanner-container img");
      const leftCell = [];
      if (heading) leftCell.push(heading);
      if (description) leftCell.push(description);
      if (ctaLink) leftCell.push(ctaLink);
      const rightCell = [];
      if (image) rightCell.push(image);
      cells.push([leftCell, rightCell]);
    } else {
      const children = Array.from(element.children);
      const midpoint = Math.ceil(children.length / 2);
      const leftCell = children.slice(0, midpoint);
      const rightCell = children.slice(midpoint);
      cells.push([leftCell, rightCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/nationwide-intermediary-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header.Header", "footer.Footer", "noscript", "link", "iframe"]);
    }
  }

  // tools/importer/transformers/nationwide-intermediary-sections.js
  function transform2(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const { document } = payload;
    const main = element;
    const hero = main.querySelector(".Hero.Hero-Theme--NEL");
    const perfCards = main.querySelector(".PerformanceCards");
    const imageArticle = main.querySelector(".ImageAndArticle");
    const quickLinksContent = main.querySelector(".ContentCardWithArticle");
    const contentCardsWrapper = main.querySelector(".ContentCardsWithImage");
    const newsBanner = main.querySelector(".NewsBanner");
    if (!hero) return;
    const fragment = document.createDocumentFragment();
    fragment.appendChild(hero);
    const meta1 = document.createElement("table");
    meta1.innerHTML = '<tr><th colspan="2">Section Metadata</th></tr><tr><td>style</td><td>dark-blue</td></tr>';
    fragment.appendChild(meta1);
    fragment.appendChild(document.createElement("hr"));
    if (perfCards) {
      const serviceTitle = perfCards.querySelector(".serviceCardsTitle");
      if (serviceTitle) {
        const h2 = serviceTitle.querySelector("h2");
        const p = serviceTitle.querySelector("p");
        if (h2) fragment.appendChild(h2);
        if (p) fragment.appendChild(p);
      }
      fragment.appendChild(perfCards);
    }
    if (imageArticle) fragment.appendChild(imageArticle);
    fragment.appendChild(document.createElement("hr"));
    if (quickLinksContent) fragment.appendChild(quickLinksContent);
    const meta2 = document.createElement("table");
    meta2.innerHTML = '<tr><th colspan="2">Section Metadata</th></tr><tr><td>style</td><td>light</td></tr>';
    fragment.appendChild(meta2);
    fragment.appendChild(document.createElement("hr"));
    if (contentCardsWrapper) fragment.appendChild(contentCardsWrapper);
    fragment.appendChild(document.createElement("hr"));
    if (newsBanner) fragment.appendChild(newsBanner);
    const meta3 = document.createElement("table");
    meta3.innerHTML = '<tr><th colspan="2">Section Metadata</th></tr><tr><td>style</td><td>light</td></tr>';
    fragment.appendChild(meta3);
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.appendChild(fragment);
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "cards": parse2,
    "columns": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Nationwide Intermediary homepage - main landing page with hero, navigation, product information, and contact details",
    urls: [
      "https://www.nationwide-intermediary.co.uk/"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".Hero.Hero-Theme--NEL"]
      },
      {
        name: "cards",
        instances: [".PerformanceCards", ".ContentCardsWithImage"]
      },
      {
        name: "columns",
        instances: [".ImageAndArticle", ".ContentCardWithArticle", ".NewsBanner"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero Banner",
        selector: "section.o-Container:first-of-type",
        style: "dark-blue",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-service-levels",
        name: "Service Levels",
        selector: ".PerformanceCards",
        style: null,
        blocks: ["cards"],
        defaultContent: [".serviceCardsTitle h2", ".serviceCardsTitle p"]
      },
      {
        id: "section-interest-only",
        name: "Interest Only Promo",
        selector: ".ImageAndArticle",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-quick-links",
        name: "Quick Links with Calculator",
        selector: ".o-Container--background.primaryBackground",
        style: "dark-blue",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-content-cards",
        name: "Content Cards",
        selector: ".ContentCardsWithImage",
        style: null,
        blocks: ["cards"],
        defaultContent: []
      },
      {
        id: "section-news-banner",
        name: "News Banner",
        selector: ".NewsBanner",
        style: "dark-blue",
        blocks: ["columns"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
