export function markersInit(googleMaps, markers, map) {
	markers &&
		markers.forEach(({ id, markerOptions }) => {
			new googleMaps.Marker(Object.assign({}, { map }, markerOptions));
		});
}
