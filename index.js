const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const mp = require('multiparty');

const server = http.createServer((req, res) => {
	let path, query;

	// set path
	if (/.+?(?=\?)/.exec(req.url)) {
		path = /.+?(?=\?)/.exec(req.url)[0];
	} else path = req.url;

	if (/(?=\?).+/.exec(req.url)) {
		query = qs.parse(/\?(.*)/.exec(req.url)[1]);
		console.log(query)
	}
	// console.log(req);

	if (path === '/upload' && req.method === 'GET') {
		send('./index.html').to(res);
	} 

	if (path === '/upload' && req.method === 'POST') {
		let form = new mp.Form({uploadDir:'uploads'});
		form.parse(req, function(err, fields, files) {
      send('./index.html').to(res);
      // console.log(files)
      // console.log(fields)
    });
	}

	if (path === '/uploads' && req.method === 'GET') {
		send('./uploads/'+query.id).to(res);
	}

	if (path === '/list' && req.method === 'GET') {
		console.log('yes')
		html = "<!DOCTYPE html><html><head></head><body>"
		fs.readdir('uploads', (err, ls) => {
			if (err) throw err;
			ls.forEach(i => {
				html+= "<div style='margin-top:10px; margin-bottom:10px'><img src='/uploads?id="+i+"' /></div>"
			})
			html+="</body></html>"
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
