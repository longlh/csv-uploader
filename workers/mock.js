const kue = require('kue');
const path = require('path');

var queue = kue.createQueue({
	prefix: 'q',
	redis: {
		port: 6379,
		host: '127.0.0.1',
	}
});

queue
	.create('csv', {
		path: path.resolve(__dirname, '../upload/sample-min.csv')
	})
	.removeOnComplete(true)
	.save(() => {
		console.log('sent');
	});
