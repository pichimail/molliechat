export const MOLLIECHAT_BRAND_NAME = 'MollieChat';

const PRODUCT_NAME_PATTERN = /Rocket(?:\.|\s*)Chat/gi;

export const brandVisibleText = (value: string): string => value.replace(PRODUCT_NAME_PATTERN, MOLLIECHAT_BRAND_NAME);

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
};

const installMollieChatBrowserBranding = (): void => {
	const start = (): void => {
		ensureBrowserBranding();

		// Observe only browser metadata. Never mutate application content, links,
		// user data, room data, routes, or interactive elements.
		const observer = new MutationObserver(() => ensureBrowserBranding());
		observer.observe(document.head, {
			attributes: true,
			attributeFilter: ['content'],
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

installMollieChatBrowserBranding();
