import { i18n } from '../../app/utils/lib/i18n';

export const MOLLIECHAT_BRAND_NAME = 'MollieChat';
export const MOLLIECHAT_PROJECT_URL = 'https://github.com/pichimail/molliechat';

const PRODUCT_NAME_PATTERN = /Rocket(?:\.|\s*)Chat/gi;
const VENDOR_HOST_PATTERN = /(^|\.)rocket\.chat$/i;
const VENDOR_GITHUB_PATH_PATTERN = /^\/RocketChat(?:\/|$)/i;

const USER_CONTENT_SELECTOR = [
	'[contenteditable="true"]',
	'textarea',
	'input',
	'code',
	'pre',
	'kbd',
	'samp',
	'[data-qa="message"]',
	'[data-qa^="message-"]',
	'[data-qa*="message-body"]',
	'[data-qa*="composer"]',
	'[data-testid*="message"]',
	'[data-testid*="composer"]',
	'.rcx-message',
	'.rcx-message-body',
	'.message-body',
	'.js-message-text',
].join(',');

const TEXT_ATTRIBUTES = ['title', 'aria-label', 'alt', 'placeholder'] as const;
const STOCK_BRAND_ASSET_PATTERN = /(?:^|\/)images\/logo\/(?:logo(?:_dark)?|icon|favicon[^/]*|android-chrome[^/]*|apple-touch-icon[^/]*|mstile[^/]*|safari-pinned-tab)\.(?:svg|png|ico)(?:\?.*)?$/i;

export const brandVisibleText = (value: string): string => value.replace(PRODUCT_NAME_PATTERN, MOLLIECHAT_BRAND_NAME);

const isUserAuthoredContent = (node: Node): boolean => {
	const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
	return Boolean(element?.closest(USER_CONTENT_SELECTOR));
};

const getBrandAssetUrl = (asset: 'logo.svg' | 'logo_dark.svg' | 'icon.svg'): string =>
	new URL(`/images/logo/${asset}`, window.location.origin).toString();

const isVendorUrl = (url: URL): boolean =>
	VENDOR_HOST_PATTERN.test(url.hostname) || (url.hostname.toLowerCase() === 'github.com' && VENDOR_GITHUB_PATH_PATTERN.test(url.pathname));

const brandTextNode = (node: Text): void => {
	if (isUserAuthoredContent(node) || !node.nodeValue || !PRODUCT_NAME_PATTERN.test(node.nodeValue)) {
		PRODUCT_NAME_PATTERN.lastIndex = 0;
		return;
	}

	PRODUCT_NAME_PATTERN.lastIndex = 0;
	const brandedValue = brandVisibleText(node.nodeValue);
	if (brandedValue !== node.nodeValue) {
		node.nodeValue = brandedValue;
	}
};

const brandAttributes = (element: Element): void => {
	if (isUserAuthoredContent(element)) {
		return;
	}

	for (const attribute of TEXT_ATTRIBUTES) {
		const value = element.getAttribute(attribute);
		if (!value) {
			continue;
		}

		const brandedValue = brandVisibleText(value);
		if (brandedValue !== value) {
			element.setAttribute(attribute, brandedValue);
		}
	}
};

const brandAnchor = (anchor: HTMLAnchorElement): void => {
	if (isUserAuthoredContent(anchor)) {
		return;
	}

	const href = anchor.getAttribute('href');
	if (!href) {
		return;
	}

	try {
		const url = new URL(href, window.location.href);
		if (!isVendorUrl(url)) {
			return;
		}

		anchor.href = MOLLIECHAT_PROJECT_URL;
		anchor.rel = anchor.rel || 'noopener noreferrer';
		anchor.title = MOLLIECHAT_BRAND_NAME;
	} catch {
		// Invalid or application-specific URLs must remain untouched.
	}
};

const brandImage = (image: HTMLImageElement): void => {
	if (isUserAuthoredContent(image)) {
		return;
	}

	const source = image.getAttribute('src');
	if (!source) {
		return;
	}

	let isVendorHosted = false;
	try {
		isVendorHosted = isVendorUrl(new URL(source, window.location.href));
	} catch {
		isVendorHosted = false;
	}

	if (!isVendorHosted && !STOCK_BRAND_ASSET_PATTERN.test(source)) {
		return;
	}

	const isWordmark = /\/logo(?:_dark)?\.svg/i.test(source);
	const isDarkWordmark = /\/logo_dark\.svg/i.test(source);
	image.src = getBrandAssetUrl(isWordmark ? (isDarkWordmark ? 'logo_dark.svg' : 'logo.svg') : 'icon.svg');
	image.alt = MOLLIECHAT_BRAND_NAME;
};

const brandElement = (element: Element): void => {
	brandAttributes(element);

	if (element instanceof HTMLAnchorElement) {
		brandAnchor(element);
	}

	if (element instanceof HTMLImageElement) {
		brandImage(element);
	}
};

const brandSubtree = (root: Node): void => {
	if (root.nodeType === Node.TEXT_NODE) {
		brandTextNode(root as Text);
		return;
	}

	if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
		return;
	}

	if (root.nodeType === Node.ELEMENT_NODE) {
		brandElement(root as Element);
	}

	const elementRoot = root as ParentNode;
	for (const element of elementRoot.querySelectorAll('*')) {
		brandElement(element);
	}

	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	let currentNode = walker.nextNode();
	while (currentNode) {
		brandTextNode(currentNode as Text);
		currentNode = walker.nextNode();
	}
};

const ensureMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string): void => {
	let meta = document.head.querySelector<HTMLMetaElement>(selector);
	if (!meta) {
		meta = document.createElement('meta');
		meta.setAttribute(attribute, key);
		document.head.appendChild(meta);
	}
	meta.content = content;
};

const ensureBrowserBranding = (): void => {
	document.documentElement.dataset.productName = MOLLIECHAT_BRAND_NAME;
	document.title = brandVisibleText(document.title || MOLLIECHAT_BRAND_NAME);

	ensureMeta('meta[name="application-name"]', 'name', 'application-name', MOLLIECHAT_BRAND_NAME);
	ensureMeta('meta[name="apple-mobile-web-app-title"]', 'name', 'apple-mobile-web-app-title', MOLLIECHAT_BRAND_NAME);
	ensureMeta('meta[property="og:site_name"]', 'property', 'og:site_name', MOLLIECHAT_BRAND_NAME);

	for (const link of document.head.querySelectorAll<HTMLLinkElement>('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"]')) {
		link.href = getBrandAssetUrl('icon.svg');
	}
};

const installTranslationBranding = (): void => {
	const originalTranslate = i18n.t.bind(i18n);
	i18n.t = ((...args: Parameters<typeof i18n.t>) => {
		const translated = originalTranslate(...args);
		return typeof translated === 'string' ? brandVisibleText(translated) : translated;
	}) as typeof i18n.t;
};

const installMollieChatBrowserBranding = (): void => {
	const start = (): void => {
		ensureBrowserBranding();
		brandSubtree(document.documentElement);

		const pendingNodes = new Set<Node>();
		let flushScheduled = false;

		const flush = (): void => {
			flushScheduled = false;
			for (const node of pendingNodes) {
				brandSubtree(node);
			}
			pendingNodes.clear();
			ensureBrowserBranding();
		};

		const schedule = (node: Node): void => {
			pendingNodes.add(node);
			if (!flushScheduled) {
				flushScheduled = true;
				queueMicrotask(flush);
			}
		};

		new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						schedule(node);
					}
					continue;
				}

				schedule(mutation.target);
			}
		}).observe(document.documentElement, {
			attributes: true,
			attributeFilter: [...TEXT_ATTRIBUTES, 'href', 'src'],
			characterData: true,
			childList: true,
			subtree: true,
		});
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', start, { once: true });
		return;
	}

	start();
};

installTranslationBranding();
installMollieChatBrowserBranding();
