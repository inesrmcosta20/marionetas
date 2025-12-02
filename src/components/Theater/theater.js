import './theater.css';
import ReturnButton from '../common/ReturnButton/ReturnButton';

function Theater({ onBack }) {
	return (
		<div className="theater">
			<div className="theater-left">
				<ReturnButton onClick={onBack} />
			</div>

			<div className="theater-center">
				<h1>Teatro</h1>
				</div>
		</div>
	);
}

export default Theater;