const kue = require('kue');

const Policy = require('../shared/models').Policy;

var queue = kue.createQueue({
	prefix: 'q',
	redis: {
		port: 6379,
		host: '127.0.0.1',
	}
});

queue.process('data', (job, done) => {
	var entity = JSON.parse(job.data.json);

	Policy.create(entity)
		.then((policy) => {
			console.log('Inserted Object ID: ', policy.id);
			done();
		});
});
