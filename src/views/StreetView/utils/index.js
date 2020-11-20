export function debounce(fn, time) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(fn.bind(...args), time);
	};
}

export function isEqual(pre, next) {
	let result = true;
	Object.keys(pre).forEach((key) => {
		if (pre[key] !== next[key]) {
			result = false;
			return result;
		}
	});
	return result;
}
