define(function (require) {
  try {
  	var byteData = require('../../../../dist/minibuffer.umd.js');
  	console.log(byteData.pack(2, {bits: 16}));
  	document.write('OK');
  } catch (err) {
   	document.write('ERROR');
  }
});
