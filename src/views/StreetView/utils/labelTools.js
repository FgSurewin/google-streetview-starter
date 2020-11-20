export const generateBorderStyle = (color) => ({
	border: `6px solid ${color}`,
});

export const colors = {
	default: "#000",
	success: "rgb(0, 222, 38)",
};

const turning = {
	UP: "up",
	DOWN: "down",
	LEFT: "left",
	BIG_LEFT: "bigLeft",
	RIGHT: "right",
	BIG_RIGHT: "bigRight",
	NONE: "none",
};

export function resetLabels(labels, locationInfo) {
	let result = null;
	if (labels && locationInfo) {
		result = labels.map((label) => resetSingleLabel(label, locationInfo.pov));
	}
	return result;
}

function resetSingleLabel(label, pov) {
	const result = generatePosition(label, pov);
	label.position.x = result.x;
	label.position.y = result.y;
	label.pov = pov;
	return label;
}

function generatePosition(label, pov) {
	let result;
	switch (pov.zoom) {
		case 1:
			result = computePosition(label, pov, 7.5, 7);
			break;
		default:
			result = label.position;
			break;
	}

	return result;
}

function computePosition(label, nextPov, xRatio, yRatio) {
	let result = label.position;
	const vertical = verticalVariation(label.pov.pitch, nextPov.pitch);
	const horizontal = horizontalVariation(label.pov.heading, nextPov.heading);
	result.y = handleVerticalVariation(label, nextPov, yRatio, vertical);
	result.x = handleHorizontalVariation(label, nextPov, xRatio, horizontal);
	return result;
}

/**
 *
 * @param {*} pre : Previous value of pitch
 * @param {*} next : Next value of pitch
 *
 * Algorithm:
 * Since the range of pitch is (-90, 90)
 * next - pre > 0 means turning up
 * next - pre < 0 means turning down
 */
function verticalVariation(pre, next) {
	const { UP, DOWN, NONE } = turning;
	if (pre === next) {
		return NONE;
	} else if (next - pre > 0) {
		return UP;
	} else {
		return DOWN;
	}
}
/**
 *
 * @param {*} pre : Previous value of heading
 * @param {*} next : Next value of heading
 * Algorithm:
 * The range of heading is (0, 360)
 * next - pre > 0 means turning right
 * next - pre < 0 means turning left
 * But the tricky thing is that you got negative result when you turn right from 350 degree to 20 degree.
 * Also you got positive number when you turn left from 20 degree to 350 degree.
 * To solve that, I add two restrictions called "BIG_LEFT" and "BIG_RIGHT" to recognize this two special turning.
 */
function horizontalVariation(pre, next) {
	const { LEFT, RIGHT, NONE, BIG_LEFT, BIG_RIGHT } = turning;
	if (pre === next) {
		return NONE;
	} else if (next - pre > 0) {
		if (next - pre > 300) {
			return BIG_LEFT;
		} else {
			return RIGHT;
		}
	} else {
		if (next - pre < -300) {
			return BIG_RIGHT;
		} else {
			return LEFT;
		}
	}
}

/**
 *
 * @param {*} label : Object of label
 * @param {*} nextPov : Next POV
 * @param {*} ratio : The ratio between pitch and y coordinate
 * @param {*} direction : Vertical direction
 */
function handleVerticalVariation(label, nextPov, ratio, direction) {
	const { UP, DOWN, NONE } = turning;
	switch (direction) {
		case UP:
			return label.position.y + ratio * (nextPov.pitch - label.pov.pitch);
		case DOWN:
			return label.position.y - ratio * (label.pov.pitch - nextPov.pitch);
		case NONE:
			return label.position.y;
		default:
			return label.position.y;
	}
}

/**
 *
 * @param {*} label : Object of label
 * @param {*} nextPov : Next POV
 * @param {*} ratio : The ratio between heading and x coordinate
 * @param {*} direction : Horizontal direction
 */
function handleHorizontalVariation(label, nextPov, ratio, direction) {
	const { LEFT, RIGHT, NONE, BIG_LEFT, BIG_RIGHT } = turning;
	switch (direction) {
		case NONE:
			return label.position.x;
		case LEFT:
			return label.position.x + ratio * (label.pov.heading - nextPov.heading);
		case BIG_LEFT:
			return (
				label.position.x + ratio * (label.pov.heading + (360 - nextPov.heading))
			);
		case BIG_RIGHT:
			return (
				label.position.x - ratio * (nextPov.heading + (360 - label.pov.heading))
			);
		case RIGHT:
			return label.position.x - ratio * (nextPov.heading - label.pov.heading);
		default:
			return label.position.x;
	}
}
