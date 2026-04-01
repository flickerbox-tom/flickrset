function assert(val, msg) {
	if (!val) throw new Error(msg);
}

function FlickrSet(options) {
	var opts = {
		api_key: null,
		photo_set: null,
		user_id: null,
		selected_size: 'Large Square',
		flickr_API: 'https://api.flickr.com/services/rest/?method=',
		format: 'json',
		wrapper_id: '#results',
		per_page: 12,
		nojsoncallback: 1,
		photo_wrapper: 'a',
		photo_wrapper_class: '',
		photo_link: true,
		photo_target: '_blank',
		photo_set_title: '',
		use_photo_set_title: false,
		photo_set_title_tag: 'h2',
		array_only: false,
		debug: false,
		random: false,
	};

	FlickrPhotosetArray = [];

	if (options) {
		for (var optKey in opts) {
			if (typeof options[optKey] !== 'undefined') {
				opts[optKey] = options[optKey];
			}
		}
	}

	this._options = opts;

	assert(this._options.api_key,   'FlickrSet: You must specify an api_key');
	assert(this._options.photo_set, 'FlickrSet: You must specify a photo_set');
	assert(this._options.user_id,   'FlickrSet: You must specify a user_id');

	this._debug(this._options);
}

/**
 * Fisher-Yates shuffle — returns a new shuffled copy of arr.
 */
FlickrSet.prototype._shuffle = function _shuffle(arr) {
	var a = arr.slice();
	for (var i = a.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
	}
	return a;
};

/**
 * Return n random items from arr without mutating it.
 * Falls back to the full array if n >= arr.length.
 */
FlickrSet.prototype._randomSubset = function _randomSubset(arr, n) {
	if (n >= arr.length) return this._shuffle(arr);
	return this._shuffle(arr).slice(0, n);
};

/**
 * run()
 * Fetches up to 500 photos from the album, then (when random:true) selects
 * a random subset of per_page items before loading sizes and rendering.
 */
FlickrSet.prototype.run = function run() {
	var scope = this;

	// Always fetch the full album (max 500) so random selection has the
	// widest pool to draw from. If random is false we still respect per_page
	// by slicing after the response arrives.
	var fetchCount = scope._options.random ? 500 : scope._options.per_page;

	var apiurl = scope._options.flickr_API +
		'flickr.photosets.getPhotos' +
		'&api_key='      + scope._options.api_key +
		'&photoset_id='  + scope._options.photo_set +
		'&user_id='      + scope._options.user_id +
		'&per_page='     + fetchCount +
		'&format='       + scope._options.format +
		'&nojsoncallback=' + scope._options.nojsoncallback;

	scope._debug('APIURL: ' + apiurl);

	$.getJSON(apiurl, function (json) {
		scope._debug(json);

		scope._options.photo_set_title = json.photoset.title;
		scope._debug(scope._options.photo_set_title);

		if (!scope._options.array_only) {
			scope.renderPhotosetTitle();
		}

		var photos = json.photoset.photo;

		// Pick the photos we'll actually show.
		var selected = scope._options.random
			? scope._randomSubset(photos, scope._options.per_page)
			: photos; // already limited to per_page by the API call

		scope._debug('Selected ' + selected.length + ' photo(s) from ' + photos.length);

		$.each(selected, function (i, photo) {
			var apiurl_size = scope.getApiurlSize(photo.id);

			$.getJSON(apiurl_size, function (size) {
				scope._debug(size);

				$.each(size.sizes.size, function (i, s) {
					if (s.label === scope._options.selected_size) {
						if (scope._options.array_only) {
							FlickrPhotosetArray.push([s.url, s.source]);
						} else {
							scope.renderPhotoWrapper(s.url, s.source);
						}
					}
				});
			});
		});
	});

	if (scope._options.array_only) {
		scope._debug(FlickrPhotosetArray);
	}
};

FlickrSet.prototype.renderPhotosetTitle = function renderPhotosetTitle() {
	if (this._options.use_photo_set_title) {
		$(this._options.wrapper_id).before(
			'<' + this._options.photo_set_title_tag + '>' +
			this._options.photo_set_title +
			'</' + this._options.photo_set_title_tag + '>'
		);
	}
};

FlickrSet.prototype.renderPhotoWrapper = function renderPhotoWrapper(url, source) {
	if (this._options.photo_link === true && this._options.photo_wrapper === 'a') {
		$(this._options.wrapper_id).append(
			'<a href="' + url + '" target="' + this._options.photo_target +
			'" class="' + this._options.photo_wrapper_class +
			'"><img src="' + source + '"/></a>'
		);
	} else {
		$(this._options.wrapper_id).append(
			'<' + this._options.photo_wrapper +
			' class="' + this._options.photo_wrapper_class +
			'"><img src="' + source + '"/></' + this._options.photo_wrapper + '>'
		);
	}
};

FlickrSet.prototype.getApiurlSize = function getApiurlSize(id) {
	this._debug('getApiurlSize: ' + id);
	return this._options.flickr_API + 'flickr.photos.getSizes' +
		'&api_key=' + this._options.api_key +
		'&photo_id=' + id +
		'&format=' + this._options.format +
		'&nojsoncallback=' + this._options.nojsoncallback;
};

FlickrSet.prototype._debug = function _debug(message) {
	if (this._options.debug && console) {
		console.log(message);
	}
};
