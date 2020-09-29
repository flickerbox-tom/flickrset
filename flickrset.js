function assert(val, msg) {
	if (!val) {
		throw new Error(msg);
	}
}
function FlickrSet(options){

	// Set Default Options
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
	};

	FlickrPhotosetArray = [];

	// Options combine
    if (options) {
      for (var optKey in opts) {
        if (typeof options[optKey] !== 'undefined') {
          opts[optKey] = options[optKey];
        }
      }
    }

    // Set Main options object
    this._options = opts;

    // Assertions
    assert(this._options.api_key, "FlickrSet: You must specify an api_key");
    assert(this._options.photo_set, "FlickrSet: You must specify a photo_set");
    assert(this._options.user_id, "FlickrSet: You must specify a user_id");

    // Dump the Options
    this._debug(`API: ${this._options.flickr_API}`);
    this._debug(this._options);

}

/**
 *
 * Run the FlickrSet based on the options
 *
 */
FlickrSet.prototype.run = function run(){

	// Gonna need this
	var scope = this;

	// set APIurl to get photoset
	apiurl = `${this._options.flickr_API}flickr.photosets.getPhotos&api_key=${this._options.api_key}&photoset_id=${this._options.photo_set}&user_id=${this._options.user_id}&per_page=${this._options.per_page}&format=${this._options.format}&nojsoncallback=${this._options.nojsoncallback}`;

	// Debug APIURL
	this._debug("APIURL: "+apiurl);

	// Get PhotoSet
	$.getJSON(apiurl,function(json){
		
		// Debug Initial JSON Call
		scope._debug(json);

		// Set photo_set_title
		scope._options.photo_set_title = json.photoset.title;

		// Debug PhotoSet Title
		scope._debug(scope._options.photo_set_title);

		// Render photo_set_title
		if (scope._options.array_only == false) {
			scope.renderPhotosetTitle();
		}
		
		// Get Photoset Sizes
		$.each(json.photoset.photo,function(i,myresult){
			
			// Get the APIURL for each size
			apiurl_size = scope.getApiurlSize(myresult.id);
			
			$.getJSON(apiurl_size,function(size){
				scope._debug(size);
				// For each of the sizes that come back render just the specific size we want.
				$.each(size.sizes.size,function(i,myresult_size){
					if(myresult_size.label==scope._options.selected_size){
						if (scope._options.array_only) {
							FlickrPhotosetArray.push([myresult_size.url,myresult_size.source]);
						}else{
							scope.renderPhotoWrapper(myresult_size.url,myresult_size.source);
						}
						
					}

				})
			})
		});
	});

	if (scope._options.array_only) {
		scope._debug(FlickrPhotosetArray);
	}
}

/**
 *
 * renderPhotosetTitle
 * Render the Title if we want.
 */
FlickrSet.prototype.renderPhotosetTitle = function renderPhotosetTitle(){
	if (this._options.use_photo_set_title) {
		$(this._options.wrapper_id).before('<'+this._options.photo_set_title_tag+' >'+this._options.photo_set_title+'</'+this._options.photo_set_title_tag+'>');
	}
}

/**
 *
 * renderPhotoWrapper
 * wraps each Photo and adds it to the DOM
 */
FlickrSet.prototype.renderPhotoWrapper = function renderPhotoWrapper(url,source){
	if (this._options.photo_link === true && this._options.photo_wrapper == 'a') {
		$(this._options.wrapper_id).append('<'+this._options.photo_wrapper+' href="'+url+'" target="'+this._options.photo_target+'" class="'+this._options.photo_wrapper_class+'"><img src="'+source+'"/></'+this._options.photo_wrapper+'>');
	}else{
		$(this._options.wrapper_id).append('<'+this._options.photo_wrapper+' class="'+this._options.photo_wrapper_class+'"><img src="'+source+'"/></'+this._options.photo_wrapper+'>');
	}
}

/**
 *
 * getApiurlSize
 * get each API url to get its specific photo sizes
 */
FlickrSet.prototype.getApiurlSize = function getApiurlSize(id){
	this._debug("getApiurlSize: " +id);
	return this._options.flickr_API+'flickr.photos.getSizes'+'&api_key='+this._options.api_key+'&photo_id='+id+'&format='+this._options.format+'&nojsoncallback='+this._options.nojsoncallback;
}

/**
 *
 * _debug
 * run console log messages when options debug is set
 */
FlickrSet.prototype._debug = function debug(message) {
	if (this._options.debug && console) {
		console.log(message);
	}
}
