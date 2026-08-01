import type { ISetting } from '@rocket.chat/core-typings';
import { useContext, useMemo, useSyncExternalStore } from 'react';

import { SettingsContext } from '../SettingsContext';

const MOLLIECHAT_SITE_NAME = 'MollieChat';

export const useSettingStructure = (_id: ISetting['_id']): ISetting | undefined => {
	const { querySetting } = useContext(SettingsContext);
	const [subscribe, getSnapshot] = useMemo(() => querySetting(_id), [querySetting, _id]);
	const setting = useSyncExternalStore(subscribe, getSnapshot);

	return useMemo(() => {
		if (_id !== 'Site_Name' || !setting) {
			return setting;
		}

		return {
			...setting,
			value: MOLLIECHAT_SITE_NAME,
		};
	}, [_id, setting]);
};
