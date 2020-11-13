import React from "react";
import OriginalMap from "../../components/OriginalMap";
import { v4 as uuidV4 } from "uuid";
import { generateBorderStyle, colors } from "./utils/labelTools";

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

	const onPositionChanged = (e, map) => {
		locationInfo.current = e;
		map.setCenter(locationInfo.current.position);
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
				events={{ onPositionChanged }}
				markers={markers}
				labels={labels}
				labelMode={labelMode}
				handleStreetViewClick={handleStreetViewClick}
			/>
		</div>
	);
};

export default StreetView;
