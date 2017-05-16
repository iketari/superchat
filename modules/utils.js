function deepEqual (src, dest) {
	return JSON.stringify(src) === JSON.stringify(dest);
}

export {deepEqual};