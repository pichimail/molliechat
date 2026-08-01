import { i18n } from '../../app/utils/lib/i18n';

export const MOLLIECHAT_BRAND_NAME = 'MollieChat';

const PRODUCT_NAME_PATTERN = /Rocket(?:\.|\s*)Chat/gi;
const BRAND_ICON_PATH = '/images/logo/icon.svg';
let translationBrandingInstalled = false;

export const brandVisibleText = (value: string): string => value.replace(PRODUCT_NAME_PATTERN, MOLLIECHAT_BRAND_NAME);

const installTranslationBranding = (): void => {
	if (translationBrandingInstalled) {
		return;
	}

	translationBrandingInstalled = true;
	const originalTranslate = i18n.t.bind(i18n);

	// Normalize only text returned by the translation engine. This does not
	// inspect or mutate room messages, user input, route values, URLs, API data,
	// database values, settings identifiers, or any other application payload.
	i18n.t = ((...args: Parameters<typeof i18n.t>) => {
		const translated = originalTranslate(...args);
		return typeof translated === 'string' ? brandVisibleText(translated) : translated;
	}) as typeof i18n.t;
};

const ensureMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string): void => {
	let meta = document.head.querySelector<HTMLMetaElement>(selector);
	if (!meta) {
		meta = document.createElement('meta');
		meta.setAttribute(attribute, key);
		document.head.appendChild(meta);
	}

	if (meta.content !== content) {
		meta.content = content;
	}
};

const ensureBrowserBranding = (): void => {
	document.documentElement.dataset.productName = MOLLIECHAT_BRAND_NAME;

	const brandedTitle = brandVisibleText(document.title || MOLLIECHAT_BRAND_NAME);
	if (document.title !== brandedTitle) {
		document.title = brandedTitle;
	}

	ensureMeta('meta[name="application-name"]', 'name', 'application-name', MOLLIECHAT_BRAND_NAME);
	ensureMeta('meta[name="apple-mobile-web-app-title"]', 'name', 'apple-mobile-web-app-title', MOLLIECHAT_BRAND_NAME);
	ensureMeta('meta[property="og:site_name"]', 'property', 'og:site_name', MOLLIECHAT_BRAND_NAME);

	const brandedIcon = new URL(BRAND_ICON_PATH, window.location.origin).toString();
	for (const link of document.head.querySelectorAll<HTMLLinkElement>(
		'link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"]',
	)) {
		if (link.href !== brandedIcon) {
			link.href = brandedIcon;
		}
	}
};

const installMollieChatBrowserBranding = (): void => {
	const start = (): void => {
		ensureBrowserBranding();

		// Observe only browser metadata. Never mutate application content, links,
		// user data, room data, routes, or interactive elements.
		const observer = new MutationObserver(() => ensureBrowserBranding());
		observer.observe(document.head, {
			attributes: true,
			attributeFilter: ['content', 'href'],
			characterData: true,
			childList: true,
			subtree: true,
		});

		window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', start, { once: true });
		return;
	}

	start();
};

installTranslationBranding();
installMollieChatBrowserBranding();
