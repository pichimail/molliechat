import { Box } from '@rocket.chat/fuselage';
import { useSetting } from '@rocket.chat/ui-contexts';

export const LoginPoweredBy = () => {
	const hidePoweredBy = useSetting('Layout_Login_Hide_Powered_By', false);
	if (hidePoweredBy) {
		return null;
	}

	return (
		<Box mbe={18}>
			Powered by <strong>MollieChat</strong>
		</Box>
	);
};

export default LoginPoweredBy;
