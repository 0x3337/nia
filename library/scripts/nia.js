/**
 * Designed by 0x3337
 * Created at: 23.03.2015
 * Build: 18B401
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.memoize = factory();
  }
})(this, function() {
  'use strict';

  var eKey = document.querySelector('.key-block input');
  var eInput = document.querySelector('.input-block');
  var eOutput = document.querySelector('.output-block');

  function nia() {
		var text = eInput.value.toLowerCase();
		var key = eKey.value;;
		var n = 0;

		var alphabet = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я',
						'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
						',', '—', '-', '‑', '’'];
		var arr = ['~a', '~b', '~v', '~g', '~d', '~e~', '~yo', '~zh', '~z~', '~i', '~yi', '~k', '~l', '~m', '~n', '~o', '~p', '~r', '~s~', '~t', '~u', '~f', '~h', '~c~', '~ch', '~sh', '~sc', '~sl', '~y~', '~sf', '~ey', '~yu', '~ya',
				   '`a', '`b', '`c', '`d', '`e', '`f', '`g', '`h', '`i', '`j',
				   '`y', '`k', '`l', '`m', '`n'];

		if (text.charCodeAt(0) <= 1103) {
			for (var i = 0; i < arr.length; i++)
				text = text.replace(new RegExp(alphabet[i], 'g'), arr[i]);

			text = text
				.replace(/\./g, '`z')
				.replace(/\!/g, '`o')
				.replace(/\?/g, '`p')
				.replace(/\(/g, '{')
				.replace(/\)/g, '}')
				.replace(/\s/g, String.fromCharCode(127))
				.replace(new RegExp(String.fromCharCode(10), 'g'), String.fromCharCode(127) + 'n' + String.fromCharCode(127));
			
			if (key) {
				key = sha256(key);
				var j = 0, x = 0;
				var newString = '';

				for (var i = 0; i < arr.length; i++)
					key = key.replace(new RegExp(alphabet[i], 'g'), arr[i]);
				
				for (var i = 0; i < text.length; i++) {
					if (text.charCodeAt(i) >= 96) {
						if (j == key.length) j = 0;
						x = text.charCodeAt(i) + key.charCodeAt(j) - 96;
						if (x > 127) x -= 32;
						newString += String.fromCharCode(x);
						j++;
					}
				}
				text = newString;
			}

			text = text.replace(new RegExp(/[|]/g), '`vl');

			while (n < text.length) {
				var x = 4, y = 40859;

				if (text.charCodeAt(n) >= 32 && text.charCodeAt(n) <= 64) n++;
				if (text.charCodeAt(n + 1) >= 32 && text.charCodeAt(n + 1) <= 64) n++;
				else {
					for (var m = 96; m <= 127; m++) {
						if (m != 124) {
							if (m == text.charCodeAt(n)) {
								i = (text.charCodeAt(n) + x) + (text.charCodeAt(n + 1) - 95);
								text = text.replace(new RegExp(text[n] + text[n + 1]), String.fromCharCode(i + y));
							}
							if (m == 123) x += 98;
							else x+= 99;
							y -= 68;
						}
					}
					n++;
				}
			}
		
			for (var i = 96; i <= 123; i++)
				text = text.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(i + 41856));
					
			for (var i = 125; i <= 127; i++)
				text = text.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(i + 41856));
		}
		else if (text.charCodeAt(0) >= 40960) {
			var x = 40960;
			var y = 40864;
						
			for (var i = 41952; i <= 41983; i++)
				text = text.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(i - 41856));
						
			for (var m = 96; m <= 127; m++) {
				if (m != 124) {
					for (var i = x; i <= x + 31; i++)
						text = text.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(m) + String.fromCharCode(i - y));
							
					x += 32;
					y += 32;
				}
			}
				
			text = text.replace(new RegExp('`vl', 'g'), '|');
				
			if (key) {
				key = sha256(key);
				var j = 0, x = 0;
				var newString = '';

				for (var i = 0; i < arr.length; i++)
					key = key.replace(new RegExp(alphabet[i], 'g'), arr[i]);

				for (var i = 0; i < text.length; i++) {
					if (text.charCodeAt(i) >= 96) {
						if (j == key.length) j = 0;
						x = text.charCodeAt(i) - key.charCodeAt(j) + 96;
						if (x < 96) x += 32;
						if( x == 124) x++;
						newString += String.fromCharCode(x);
						j++;
					}
				}
				text = newString;
			}
			
			for (var i = 0; i < alphabet.length; i++)
				text = text.replace(new RegExp(arr[i], 'g'), alphabet[i]);

			text = text.replace(new RegExp('`z', 'g'), '.');
			text = text.replace(new RegExp('`o', 'g'), '!');
			text = text.replace(new RegExp('`p', 'g'), '?');
			text = text.replace(new RegExp(/[{]/g), '(');
			text = text.replace(new RegExp(/[}]/g), ')');
			text = text.replace(new RegExp(String.fromCharCode(127) + 'n' + String.fromCharCode(127), 'g'), String.fromCharCode(10));
			text = text.replace(new RegExp(String.fromCharCode(127), 'g'), ' ');
		}
		
		eOutput.innerHTML = text;
	}

	eKey.addEventListener('input', nia);
	eInput.addEventListener('input', nia);
	eOutput.addEventListener('input', nia);
});