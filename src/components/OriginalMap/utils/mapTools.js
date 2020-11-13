export const defaultMapOptions = {
	mapTypeControlOptions: {
		mapTypeIds: [],
	},
	zoomControl: false,
	gestureHandling: "none",
	fullscreenControl: false,
	panControl: false,
};

/**
 *
 * @param {*} options is mapOption
 */
export const combineMapOptions = (options) =>
	Object.assign({}, options, defaultMapOptions);
