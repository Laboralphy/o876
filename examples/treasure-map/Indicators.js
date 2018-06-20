class Indicators {
	static progress(n100) {
		let elemProgress = document.querySelector('#progress-tiles');
		let elemProgressValue = elemProgress.querySelector('span.value');
		if (elemProgress.classList.contains('hidden')) {
			elemProgress.classList.remove('hidden');
		}
		elemProgressValue.innerText = n100.toString() + '%';
		if (n100 === 100 && !elemProgress.classList.contains('hidden')) {
			elemProgress.classList.add('hidden');
		}
	}
}

module.exports = Indicators;