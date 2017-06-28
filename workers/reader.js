const csv = require('fast-csv');
const fs = require('fs');
const kue = require('kue');

var queue = kue.createQueue({
	prefix: 'q',
	redis: {
		port: 6379,
		host: '127.0.0.1',
	}
});

queue.process('csv', (job, done) => {
	let readStream = fs
		.createReadStream(job.data.path);

	let csvStream = csv
		.fromStream(readStream, {
			headers: true
		})
		.on('data', (data) => {
			let job = queue
				.create('data', {
					json: JSON.stringify(data)
				})
				.removeOnComplete(true)
				.save(() => {
					console.log('sent: ', job.id);
				});
		})
		.on('end', () => {
			console.log('read file done');
			done();
		});
});
