(function ($) {
	var sPluginName = 'philterApp'; // Mettre ici le nom du plugin !
	var oPlugin = {};
	oPlugin[sPluginName] = function(oOptions) {
		var oDefaults = {
			// options par défaut
		};
		oOptions = $.extend(true, oDefaults, oOptions);
		
		var COMMANDS = {
blur: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'blur');
},

blur4: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'blur', {radius: 4});
},

blur8: function(canvas) {
	var p = new O876.Philter();
	var oProgress = document.getElementById('progress-blur');
	p.on('progress', function(oEvent) {
		oProgress.setAttribute('value', oEvent.value * 100 | 0);
	});
	p.on('complete', function(oEvent) {
		oProgress.style.visibility = 'hidden';
	});
	oProgress.style.visibility = 'visible';
	p.run(canvas, 'blur', {
		radius: 8,
		sync: false
	});
},

blur12win: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'blur', {
		radius: 12, 
		top: 200, 
		left: 150, 
		width: 120, 
		height: 150
	});
},

sharpen: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'sharpen');
},

sharpenmore: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'sharpen', {more: true});
},

emboss: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'emboss');
},

embossmore: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'emboss', {more: true});
},

sobelemboss: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'emboss', {sobel: true});
},

edges: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'edges');
},

grayscale: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'grayscale');
},

sepia: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'sepia');
},

noise50: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'noise', {level: 50});
},

noise100: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'noise', {level: 100});
},

noise100: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'noise', {level: 100});
},

noise100red: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'noise', {level: 100, channels: 'r'});
},

contrast10: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'contrast', {level: 10});
},

contrast50: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'contrast', {level: 50});
},

contrast40m: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'contrast', {level: -40});
},

negate: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'negate');
},

negatered: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'negate', {channels: 'r'});
},

negategreen: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'negate', {channels: 'g'});
},

negateblue: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'negate', {channels: 'b'});
},

hue: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'hsl', {
		hue: 0.28,
		saturation: 0,
		lightness: 0
	});
},

satur2: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'hsl', {
		hue: 0,
		saturation: 0.2,
		lightness: 0
	});
},
satur2m: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'hsl', {
		hue: 0,
		saturation: -0.2,
		lightness: 0
	});
},


brightness150: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'hsl', {
		hue: 0,
		saturation: 0,
		lightness: 0.5
	});
},

brightness50: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'hsl', {
		hue: 0,
		saturation: 0,
		lightness: -0.5
	});
},

kuwahara1: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'kuwahara', {radius: 1});
},

kuwahara2: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'kuwahara', {radius: 2});
},

kuwahara3: function(canvas) {
	var p = new O876.Philter();
	p.run(canvas, 'kuwahara', {radius: 3});
}
		};

		function replaceImageByCanvas($img) {
			var $canvas = $('<canvas></canvas>');
			$canvas.css('width', '100%');
			var oCtx = $canvas.get(0).getContext("2d");
			$img.after($canvas);
			$canvas.attr('width', $img.prop('naturalWidth'));
			$canvas.attr('height', $img.prop('naturalHeight'))
			oCtx.drawImage($img.get(0), 0, 0);
			$img.hide();
			$canvas.show();		
		}

		
		/**
		 * Fonction principale appelée pour chaque élément selectionné
		 * par la requete jquery.
		 */
		var main = function() {
			var $this = $(this);
			$('div.effect', $this).each(function() {
				var $div = $(this);
				var sEffect = $div.data('effect');
				
				var $img = $('img.source', $div);
				if ($img.prop('complete')) {
					replaceImageByCanvas($img);
				} else {
					$img.one('load', function(oEvent) {
						replaceImageByCanvas($(oEvent.target));
					});
				}
				
				$('a.btn', $div).on('click', function() {
					var $btn = $(this);
					var $fig = $btn.parents('figure');
					console.log($fig);
					var $canvas = $('canvas', $fig);
					console.log($canvas);
					var oCtx = $canvas.get(0).getContext('2d');
					oCtx.drawImage($img.get(0), 0, 0);
					var p = COMMANDS[$btn.data('command')];
					if (p) {
						$('pre', $div).html(p.toString());
						requestAnimationFrame(function() {
							$canvas.css('opacity', '0.4');
							requestAnimationFrame(function() {
								p($canvas.get(0));
								$canvas.animate({'opacity': '1'});
							});
						});
					}
				});
			});
		};
		
		return this.each(main);
	};
	$.fn.extend(oPlugin);
})(jQuery);
