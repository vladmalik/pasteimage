pasteimage.js
==============

jQuery plugin adds ability to paste images from clipboard to Firefox and Chrome (and possibly Safari). It's not perfect, but I'm hoping by putting it all together into a plugin we can improve it.

The plugin takes a callback function as a parameter. When a paste event is detected, the callback is triggered and the data uri of the image is passed as a parameter to the callback.

You can then upload the image to server or display it on the page.

Credits
----------------------------------------

	Joel Besda http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/
	Rafael http://stackoverflow.com/questions/11850970/javascript-blob-object-to-base64

Option 1: Show the image on the page
----------------------------------------

  Define your callback function like this:
  
    function showImage(src) {
      $("#image").attr("src", src);
    }
  
  Then assign the callback to the plugin:
  
    $.pasteimage(showImage);
  
Option 2: Upload with PHP
------------------------------

  First parse the uri to strip out "base64".
  
    var sourceSplit = source.split("base64,");
    var sourceString = sourceSplit[1];
  
  Then assign sourceString to an input field and submit with form (or use ajax).
  
  Use PHP to upload the string data to an image:
  
  	$image = imagecreatefromstring(base64_decode($sourceString));
  	imagejpeg($image, $destination, 100);

Outstanding
-------------------
Doesn't work in FF if the focus is inside another text area (hypothesis: paste event happens before the plugin can refocus on the pastecatcher DIV). Need a way to delay paste event.

Doesn't always work depending on method used to "copy" the image (e.g., Right Click > Copy)

Safari support to be tested.

IE not supported.
