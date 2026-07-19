interface RectLike {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface RevealTarget {
	x: number;
	y: number;
}

export function getRevealTarget(stageRect: RectLike, cardRect: RectLike): RevealTarget {
	const sourceX = stageRect.left + stageRect.width * 0.5;
	const sourceY = stageRect.top + stageRect.height * 0.62;
	const destinationX = cardRect.left + cardRect.width * 0.75;
	const destinationY = cardRect.top + cardRect.height * 0.5;

	return {
		x: destinationX - sourceX,
		y: destinationY - sourceY,
	};
}
