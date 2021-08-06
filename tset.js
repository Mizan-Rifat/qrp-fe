var fs = require('fs');
fs.readFile('helloworld.txt', { encoding: 'utf8' }, function (err, data) {
  var formatted = data.replace(
    '//NewAction',
    `This new line replaces the old lineasf
		asfasfaf
		asfaf
		af
	//NewAction
	`
  );
  fs.writeFile('helloworld.txt', formatted, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
