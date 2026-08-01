import { Box } from '@rocket.chat/fuselage';
import { useLicense, useLicenseName } from '@rocket.chat/ui-client';

import { brandVisibleText, MOLLIECHAT_BRAND_NAME } from '../../lib/mollieChatBranding';

export const SidebarFooterWatermark = () => {
	const response = useLicense();
	const licenseName = useLicenseName();

	if (response.isLoading || response.isError) {
		return null;
	}

	if (licenseName.isError || licenseName.isLoading) {
		return null;
	}

	const license = response.data;

	if (license?.activeModules.includes('hide-watermark') && !license.trial) {
		return null;
	}

	const brandedLicenseName = licenseName.data ? brandVisibleText(licenseName.data) : undefined;

	return (
		<Box pi={16} pbe={8}>
			<Box fontScale='micro' color='hint' pbe={4}>
				{MOLLIECHAT_BRAND_NAME}
			</Box>
			{brandedLicenseName && (
				<Box fontScale='micro' color='pure-white' pbe={4}>
					{brandedLicenseName}
				</Box>
			)}
		</Box>
	);
};
