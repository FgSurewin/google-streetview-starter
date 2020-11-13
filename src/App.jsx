import StreetView from "./views/StreetView";

function App() {
	return (
		<div
			style={{
				display: "flex",
				width: "100vw",
				height: "100vh",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<StreetView />
		</div>
	);
}

export default App;
