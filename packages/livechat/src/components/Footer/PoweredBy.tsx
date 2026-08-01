import styles from './styles.scss';
import { createClassName } from '../../helpers/createClassName';

type PoweredByProps = {
	className?: string;
};

export const PoweredBy = ({ className, ...props }: PoweredByProps) => (
	<h3 data-qa='livechat-watermark' className={createClassName(styles, 'powered-by', {}, [className])} {...props}>
		Powered by <strong>MollieChat</strong>
	</h3>
);

export default PoweredBy;
