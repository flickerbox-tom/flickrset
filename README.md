# Flickrset
Simple Flickr photoset implementation using jQuery (1, 2 or 3).

This uses the following Flickr API endpoint to pull in a public set of photos to your page using Javascript.

## Installation
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="text/javascript" src="path/to/flickrset.min.js"></script>
```

## Basic Usage
```html
<div id="FlickrSet"></div>
<script type="text/javascript">
$(document).ready(function(){
	var photos = new FlickrSet({
		api_key: 'YOUR_API_KEY', 
		photo_set: 'YOUR_PHOTOSET_ID', 
		user_id: 'YOUR_USER_ID', 
		selected_size: 'Large Square',
		wrapper_id: '#FlickrSet',
	});
	photos.run();
});
</script>
```
## Requirements
jQuery is required. Version 1, 2, or 3 will work just fine. 

https://developers.google.com/speed/libraries#jquery


## Options
| Key  | Default Value  | Valid types | Description  |
|---|---|---|---|
| `api_key` | `null` | `String` | **Required.** You can get this from your Flickr account here. https://www.flickr.com/services/apps/create/ |
| `photo_set` | `null` | `String` | **Required.** This tells Flickrset which PUBLIC album to get from Flickr |
| `user_id` | `null` | `String` | Your Flickr ID. You can see this at the top of the right hand column here. https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos |
| `selected_size` | `Large Square` | `String` | Size of the image to get. (Square, Large Square, Thumbnail, Small, Small 320, Small 400, Medium, Medium 640, Medium 800, Large, Large 1600, Large 2048, X-Large 3k, X-Large 4k) |
| `wrapper_id` | `#results` | `String, DOM Element` | The ID of the element to put the photos in |
| `per_page` | `12` | `String `| Amount of images to get from Album. |
| `photo_wrapper` | `a` | `String` | Tag to put around the image. Default is anchor |
| `photo_target` | `_blank` | `String` | If the photo is linked |
| `use_photo_set_title` | `false` | `Boolean` | Add the title of the Album as a tag above the wrapper_id |
| `photo_set_title_tag` | `h2` | `String` | Tag to use for the Title if it is used. |
| `array_only` | `false` | `Boolean` | Add images to an array and don't output to the HTML this can be accessed as FlickrPhotosetArray from the console. |
| `debug` | `false` | `Boolean` | Add debug messages to console to help you implement. |

## Flickr Endpoints: 
https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos
https://www.flickr.com/services/api/explore/flickr.photosets.getSizes



