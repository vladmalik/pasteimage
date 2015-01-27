pasteimage.js
==============

jQuery plugin adds ability to paste images from clipboard to Firefox and Chrome (and possibly Safari). It's not perfect, but I'm hoping by putting it all together into a plugin we can improve it.

The plugin takes a callback function as a parameter. When a paste event is detected, the callback is triggered and the datauri of the image is passed as a parameter to the callback.

You can then upload the image to server or display it on the page.

Credits
----------------------------------------

Joel Besda http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/

Rafael http://stackoverflow.com/questions/11850970/javascript-blob-object-to-base64

Nick et al http://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c

Requirements
----------------------------------------
jQuery

Usage
----------------------------------------

Add within HEAD tag of page:

	function callback(src) {
		//do something e.g., assign src to image
	}
	
	$(function() {
		$.pasteimage(callback);
	});
	
Capture screenshot and use CTRL+V to paste on the page.

Option 1: Show the image on the page
----------------------------------------

 Insert an image element into the DOM: <img src="">

  Define your callback function like this:
  
    function showImage(src) {
      $("img").attr("src", src);
    }
  
  Then assign the callback to the plugin:
  
    $.pasteimage(showImage);
  
Option 2: Upload with PHP
------------------------------

  Add an input element to the HTML: <input name="sourceString" type="text">
  
  Define your callback function like this:
  
    function insertImageURI(value) {
    	// parse the uri to strip out "base64"
    	var sourceSplit = value.split("base64,");
    	var sourceString = sourceSplit[1];
    	// Write base64-encoded string into input field
      	$("input").val(sourceString);
    }

  Then submit this field with a form (or use ajax).
  
  On the backend, use PHP to upload the string post data to a jpeg image:
  	
  	$sourceString = $_POST["sourceString"];
  	$image = imagecreatefromstring(base64_decode($sourceString));
  	imagejpeg($image, $destination, 100);

Issues
-------------------
Doesn't work in FF if the focus is inside another text area (hypothesis: paste event happens before the plugin can refocus on the pastecatcher DIV). Need a way to delay paste event.

Doesn't always work depending on method used to "copy" the image (e.g., Right Click > Copy)

Safari support to be tested.

IE not supported.
