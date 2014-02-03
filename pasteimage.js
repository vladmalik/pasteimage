/* Readme file has additional notes */
/* Credits: 
	Joel Besda http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/
	Rafael http://stackoverflow.com/questions/11850970/javascript-blob-object-to-base64
	Nick et al http://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c	
*/

(function($) {

	$.pasteimage = function(callback) {
		
		var allowPaste = true;
		var foundImage = false;
		if(typeof(callback) == "function") {
			
			// Patch jQuery to add clipboardData property support in the event object
			$.event.props.push('clipboardData');
			// Add the paste event listener
			$(document).bind("paste", doPaste);

			// If Firefox (doesn't support clipboard object), create DIV to catch pasted image
			if (!window.Clipboard) { // Firefox
				var pasteCatcher = $(document.createElement("div"));
				pasteCatcher.attr("contenteditable","true").css({"position" : "absolute", "left" : "-999", 	width : "0", height : "0", "overflow" : "hidden", outline : 0});
				$(document.body).prepend(pasteCatcher);
			}
		}
		// Handle paste event
		function doPaste(e)  { 

			if(allowPaste == true) {	 // conditionally set allowPaste to false in situations where you want to do regular paste instead
				// Check for event.clipboardData support
				if (e.clipboardData.items) { // Chrome
					// Get the items from the clipboard
					var items = e.clipboardData.items;
					if (items) {
						// Search clipboard items for an image
						for (var i = 0; i < items.length; i++) { // removed: i < items.length, items[i].type.indexOf("image") !== -1
							if (items[i].type.indexOf("image") !== -1) {
								//foundImage = true; Not sure why this was here								
								// Convert image to blob using File API	               
								var blob = items[i].getAsFile();
								var reader = new FileReader();
								reader.onload = function(event){
									callback(event.target.result); //event.target.results contains the base64 code to create the image
								};
								/* Convert the blob from clipboard to base64 */		
								reader.readAsDataURL(blob);
								//foundImage = false; Not sure why this was here
							}
						}
					} else { 
						alert("Nothing found in the clipboard!"); // possibly e.clipboardData undersupported
					}
				} else {
					/* If we can't handle clipboard data directly (Firefox), we need to read what was pasted from the contenteditable element */
					//Since paste event detected, focus on DIV to receive pasted image
					pasteCatcher.get(0).focus();
					foundImage = true;
					// "This is a cheap trick to make sure we read the data AFTER it has been inserted"
					setTimeout(checkInput, 100); // May need to be longer if large image
				}
			}
		}

		/* Parse the input in the paste catcher element */
		function checkInput() {
			// Store the pasted content in a variable
			if(foundImage == true) {
				var child = pasteCatcher.children().last().get(0);
				if (child) {
					// If the user pastes an image, the src attribute will represent the image as a base64 encoded string.
					if (child.tagName === "IMG" && child.src.substr(0, 5) == 'data:') {
						callback(child.src);
						foundImage = false;
					} else { 
						alert("This is not an image!");
					}
					pasteCatcher.html(""); // erase contents of pasteCatcher DIV
				} else { 
					alert("No children found in pastecatcher DIV.");
				}
			} else { 
				alert("No image found in the clipboard!");
			}
		}	
	}
})(jQuery);
