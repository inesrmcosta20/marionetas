import React, { useEffect, useRef, useState } from 'react';
import './theater.css';
import ReturnButton from '../common/ReturnButton/ReturnButton';
import MovementPad from './MovementPad/MovementPad';

function Theater({ onBack }) {
	const stageRef = useRef(null);
	const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
	// normalized position 0..1
	const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

	useEffect(() => {
		const update = () => {
			if (stageRef.current) {
				const rect = stageRef.current.getBoundingClientRect();
				setStageSize({ width: rect.width, height: rect.height });
			}
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	// rectangle size: wider/smaller than square to make it taller
	const rectWidth = Math.max(40, Math.round(stageSize.width * 0.06));
	const rectHeight = Math.max(200, Math.round(stageSize.height * 0.12));
	// place rectangle by center so positions match the pad knob center exactly
	const centerX = Math.round(pos.x * stageSize.width);
	const centerY = Math.round(pos.y * stageSize.height);
	const left = centerX; // kept for potential debugging
	const top = centerY;
	const tx = centerX - Math.round(rectWidth / 2);
	const ty = centerY - Math.round(rectHeight / 2);

	return (
		<div className="theater">
			<ReturnButton onClick={onBack} />

			<div className="theater-center">
				
			</div>

			{/* Full-viewport stage so the rectangle can move across entire screen */}
			<div className="theater-stage" ref={stageRef}>
				<div
					className="theater-rect"
					style={{ width: rectWidth + 'px', height: rectHeight + 'px', transform: `translate3d(${tx}px, ${ty}px, 0)` }}
				/>
			</div>

			<div className="movement-pad-container">
				<MovementPad value={pos} onChange={(v) => setPos(v)} />
			</div>
		</div>
	);
}

export default Theater;