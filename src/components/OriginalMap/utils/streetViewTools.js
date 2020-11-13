/**
 * This function is used to add built-in accessor functions into our trigger functions
 * @param {*} street Street view panorama object
 * @param {*} events An object that combines all trigger functions
 * @param {*} map Google map object
 */
export function bindStreetViewEvents(street, events, map) {
	street.addListener("pano_changed", () => {
		if (events.onPanoChanged) {
			const result = generateInfo(
				street.getPano(),
				street.getPosition(),
				street.getPov()
			);
			events.onPanoChanged(result, map);
		}
	});

	street.addListener("position_changed", () => {
		if (events.onPositionChanged) {
			const result = generateInfo(
				street.getPano(),
				street.getPosition(),
				street.getPov()
			);
			events.onPositionChanged(result, map);
		}
	});

	street.addListener("pov_changed", () => {
		if (events.onPovChanged) {
			const result = generateInfo(
				street.getPano(),
				street.getPosition(),
				street.getPov()
			);
			events.onPovChanged(result, map);
		}
	});

	street.addListener("visible_changed", () => {
		if (events.onVisibleChanged) {
			const result = generateInfo(
				street.getPano(),
				street.getPosition(),
				street.getPov()
			);
			events.onVisibleChanged(result, map);
		}
	});

	street.addListener("zoom_changed", () => {
		if (events.onZoomChanged) {
			const result = generateInfo(
				street.getPano(),
				street.getPosition(),
				street.getPov()
			);
			events.onZoomChanged(result, street);
		}
	});
}

export const defaultStreetViewOptions = {
	zoomControl: false,
	scrollwheel: false,
	fullscreenControl: false,
	panControl: false,
	linksControl: true,
	disableDefaultUI: true,
};

/**
 *
 * @param {*} options StreetViewOptions | Object
 */
export const combineStreetViewOptions = (options) =>
	Object.assign({}, options, defaultStreetViewOptions);

/**
 *
 * @param {*} pano panoID | string
 * @param {*} positionClass Position class
 * @param {*} pov POV | object
 */
function generateInfo(pano, positionClass, pov) {
	const position = {
		lat: positionClass.lat(),
		lng: positionClass.lng(),
	};
	return {
		pano,
		pov,
		position,
	};
}
