function runApp(sApp) {
	var $app = $('.app-zone');
	$app.load(sApp + '.html', function() {
		$app[sApp + 'App']();
	});
}

function main() {
	var tgPrim = new O876.ThemeGenerator();
	tgPrim.define(CONFIG.themePigment, CONFIG.theme);
}

window.addEventListener('load', main);		
