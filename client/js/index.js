$(document).ready(function() {
	var uploader = new plupload.Uploader({
		browse_button: 'browse-button',
		url: '/upload',
		multi_selection: false,
		chunk_size: '1mb',
		unique_names: true
	});

	uploader.bind('FilesAdded', function(uploader, files) {
		var file = files[0];

		if (!file) {
			return;
		}

		console.log(file);

		$('#filename').text(file.name);
	});

	uploader.bind('UploadComplete', function() {
		$('#upload-completed-msg').removeClass('hidden');

		$('#filename').text('');
	});

	uploader.init();

	$('#upload-button').click(function() {
		uploader.start();
	});

	$('.message .close').on('click', function() {
		$(this).closest('.message').transition('fade');
	});

	$('#force-count').on('click', count);

	count();
});

setInterval(function() {
	count();
}, 10e3);

function count() {
	$.ajax({
		method: 'GET',
		url: '/count'
	}).then(function(result) {
		console.log(result);

		$('#count').text(result.count);
	});
}
