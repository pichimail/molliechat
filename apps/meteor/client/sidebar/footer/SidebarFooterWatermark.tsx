import { Box } from '@rocket.chat/fuselage';
import { useLicense, useLicenseName } from '@rocket.chat/ui-client';

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

	return (
		<Box pi={16} pbe={8}>
			<Box fontScale='micro' color='hint' pbe={4}>
				Powered by MollieChat
			</Box>
			<Box fontScale='micro' color='pure-white' pbe={4}>
				{licenseName.data}
			</Box>
		</Box>
	);
};
