import React from "react";
import OriginalMap from "../../components/OriginalMap";
import { v4 as uuidV4 } from "uuid";
import { debounce, isEqual } from "./utils";
import { generateBorderStyle, colors, resetLabels } from "./utils/labelTools";

const mapOptions = {
	center: {
		lat: 40.7541,
		lng: -73.99208,
	},
	zoom: 18,
};

const streetViewOptions = {
	position: {
		lat: 40.7541,
		lng: -73.99208,
	},
	pov: {
		heading: 340,
		pitch: 0,
	},
};

const defaultInfo = {
	pano: "",
	position: {
		lat: 40.7541,
		lng: -73.99208,
	},
	pov: {
		heading: 34,
		pitch: 10,
		zoom: 1,
	},
};

const StreetView = () => {
	const [labelColor, setLabelColor] = React.useState(colors.default);
	const [labelMode, setLabelMode] = React.useState(false);
	const [labels, setLabels] = React.useState([]);
	const [markers, setMarkers] = React.useState([]);
	const locationInfo = React.useRef(defaultInfo);
	const size = React.useRef(0);

	const onPositionChanged = (e, map) => {
		locationInfo.current = e;
		map.setCenter(locationInfo.current.position);
	};

	const replaceLabels = () => {
		if (
			labels.length === size.current &&
			size.current !== 0 &&
			!isEqual(labels[0].pov, locationInfo.current.pov)
		) {
			const result = resetLabels(labels, locationInfo.current);
			if (result) {
				setLabels(result);
			}
		}
	};
	const replaceLabelsWithDebounce = debounce(replaceLabels, 400);

	const onPovChanged = (e) => {
		locationInfo.current = e;
		replaceLabelsWithDebounce();
	};

	const handleStreetViewClick = (e) => {
		if (labelMode) {
			setLabels([
				...labels,
				{
					id: uuidV4(),
					position: {
						x: e.nativeEvent.offsetX,
						y: e.nativeEvent.offsetY,
					},
					color: labelColor,
					pov: locationInfo.current.pov,
				},
			]);
			size.current++;
			setMarkers([
				...markers,
				{
					id: uuidV4(),
					markerOptions: {
						position: {
							lat: locationInfo.current.position.lat,
							lng: locationInfo.current.position.lng,
						},
					},
				},
			]);
			setLabelMode(false);
			setLabelColor(colors.default);
		}
	};
	return (
		<div>
			<button
				onClick={() => {
					setLabelColor(colors.success);
					setLabelMode(true);
				}}
			>
				Add Point
			</button>
			<OriginalMap
				api={process.env.REACT_APP_API_KEY}
				mainStyle={generateBorderStyle(labelColor)}
				streetViewOptions={streetViewOptions}
				mapOptions={mapOptions}
				events={{ onPositionChanged, onPovChanged }}
				markers={markers}
				labels={labels}
				labelMode={labelMode}
				handleStreetViewClick={handleStreetViewClick}
			/>
		</div>
	);
};

export default StreetView;
