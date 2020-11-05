import React from "react";
// import GoogleStreetview from "react-google-streetview";
import SplitView from "./splitView";

const Demo = () => {
	return (
		<>
			<SplitView apiKey={process.env.REACT_APP_API_KEY} />
		</>
	);
};
export default Demo;
