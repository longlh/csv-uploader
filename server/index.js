const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const kue = require('kue');
const path = require('path');

const Policy = require('../shared/models').Policy;

var queue = kue.createQueue({
	prefix: 'q',
	redis: {
		port: 6379,
		host: '127.0.0.1',
	}
});

// dir paths
const libDir = path.resolve(__dirname, '../node_modules');
const jsDir = path.resolve(__dirname, '../client/js');
const uploadDir = path.resolve(__dirname, '../upload');

const app = express();

// handle static files
app.use('/node_modules', express.static(libDir));
app.use('/js', express.static(jsDir));
app.use('/upload', express.static(uploadDir));

app.get('/', function(req, res, next) {
	res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.post('/upload', function(req, res, next) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		var basename = fields.name.toLowerCase();
		var storePath = path.resolve(uploadDir, basename);

		var chunk = parseInt(fields.chunk);
		var chunks = parseInt(fields.chunks);

		var rs = fs.createReadStream(files.file.path);
		var ws = fs.createWriteStream(storePath, {
			flags: 'a',
		});

		ws.on('close', function(error) {
			fs.unlink(files.file.path);

			if (chunk < chunks - 1) {
				return res.sendStatus(200);
			}

			// return res.sendStatus(201);
			// notify worker
			queue
				.create('csv', {
					path: storePath
				})
				.removeOnComplete(true)
				.save(() => {
					console.log('Notified worker');

					res.sendStatus(201);
				});
		});

		rs.pipe(ws);
	});
});

app.get('/count', function(req, res, next) {
	Policy.findAndCountAll()
		.then(result => res.json({
			count: result.count
		}))
		.catch(err => res.sendStatus(500));
})

app.listen(3000, () => console.log('Started at :3000'));
