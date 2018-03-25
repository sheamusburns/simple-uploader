const http = require('http');
const fs = require('fs');
const mp = require('multiparty');

const server = http.createServer((req, res) => {
	let path;
	if (/.+?(?=\?)/.exec(req.url)) {
		path = /.+?(?=\?)/.exec(req.url)[0];
	} else path = req.url;

	if (path === '/upload' && req.method === 'GET') {
		send('./index.html').to(res);
	} 

	if (path === '/upload' && req.method === 'POST') {
		let form = new mp.Form({uploadDir:'uploads'});
		form.parse(req, function(err, fields, files) {
      send('./index.html').to(res);
    });
	}

	if (path === '/list' && req.method === 'GET') {
		console.log('yes')
		html = "<!DOCTYPE html><html><head></head><body><ul>"
		fs.readdir('uploads', (err, ls) => {
			if (err) throw err;
			ls.forEach(i => {
				html+= "<li>"+i+"</li>"
			})
			html+="</ul></body></html>"
			// console.log(ls)
			res.write(html);
			res.end();
		});
	}

});

function send(file) {
	this.file = file;
	this.to = (loc) => {
		fs.createReadStream(this.file).pipe(loc)
	}
	return this;
}

server.listen(8000);
