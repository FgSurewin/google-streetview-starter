import React from "react";
import asyncLoading from "react-async-loader";
import Label from "./Label";
import PropTypes from "prop-types";
import { combineMapOptions } from "./utils/mapTools.js";
import { markersInit } from "./utils/markerTools";
import {
	bindStreetViewEvents,
	combineStreetViewOptions,
} from "./utils/streetViewTools";
import "./styles/style.scss";

const OriginalMap = ({
	mainStyle,
	googleMaps,
	mapOptions,
	streetViewOptions,
	events,
	markers,
	labelMode,
	labels,
	handleStreetViewClick,
}) => {
	const _map = React.useRef();
	const _streetView = React.useRef();
	const [map, setMap] = React.useState(null);
	const [streetView, setStreetView] = React.useState(null);

	React.useEffect(() => {
		if (streetView === null && map === null && googleMaps) {
			setMap(new googleMaps.Map(_map.current, combineMapOptions(mapOptions)));
			setStreetView(
				new googleMaps.StreetViewPanorama(
					_streetView.current,
					combineStreetViewOptions(streetViewOptions)
				)
			);
		}
		if (streetView !== null && map !== null) {
			map.setStreetView(streetView);
			bindStreetViewEvents(streetView, events, map);
			markersInit(googleMaps, markers, map);
		}
		return () => {
			if (map) {
				googleMaps.event.clearInstanceListeners(map);
			}
		};
	}, [
		map,
		streetView,
		googleMaps,
		mapOptions,
		streetViewOptions,
		events,
		markers,
	]);

	return (
		<div id="originalMap">
			<div
				className="streetViewContainer"
				style={mainStyle}
				onClick={handleStreetViewClick}
			>
				{labels &&
					labels.length > 0 &&
					labels.map(({ id, color, position, display }) => (
						<Label
							key={id}
							labelStyle={{
								left: `${position.x}px`,
								top: `${position.y}px`,
								backgroundColor: color,
								display,
							}}
						/>
					))}
				{labelMode && <div className="labelPanel"></div>}
				<div id="streetView" ref={_streetView} />
			</div>
			<div className="mapContainer">
				<div className="shade" />
				<div id="map" ref={_map} />
			</div>
		</div>
	);
};

OriginalMap.propTypes = {
	api: PropTypes.string,
	streetViewOptions: PropTypes.object,
	mapOptions: PropTypes.object,
	events: PropTypes.object,
	mainStyle: PropTypes.object,
	handleStreetViewClick: PropTypes.func,
	googleMaps: PropTypes.object,
	markers: PropTypes.array,
	labels: PropTypes.array,
	labelMode: PropTypes.bool,
};

OriginalMap.defaultProps = {
	api: "",
	streetViewOptions: {},
	mapOptions: {},
	events: {},
	mainStyle: {},
	handleStreetViewClick: () => {},
	googleMaps: {},
	markers: [],
	labels: [],
	labelMode: true,
};

const mapScriptsToProps = ({ api }) => ({
	googleMaps: {
		globalPath: "google.maps",
		url: `https://maps.googleapis.com/maps/api/js?key=${api}&v=weekly`,
		jsonp: true,
	},
});

export default asyncLoading(mapScriptsToProps)(OriginalMap);
