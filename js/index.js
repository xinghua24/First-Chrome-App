"use strict";


$(document).ready(function(){
	(function(){
		new Clipboard('#copy_button');
	})();
	
	
	/************************* handle replace button click******************************/
	$('#runReplace').click(function(){
		var re = new RegExp( $('#pattern').val(), 'g');
		var result = $('#input').val().replace( re, $('#replace').val() );
		$('#output').val(result);
	});
	
	/************************* handle clean button click******************************/
	$('#clean').click(function(){
		$('textarea').val('');
	});
	
	/************************* handle save button click******************************/
	$('#save').click(function(){
		if( $('#input').val() === '' && $('#pattern').val() === '' && $('#replace').val() === '' )
		{
			return
		}
		
		chrome.storage.local.get('storedData', function( result ){
			if (chrome.runtime.lastError) {
				console.log("Runtime error.");
				return;
			}
	
			console.log( result ); 
			if( !result.hasOwnProperty( "storedData" )){
				result["storedData"] = []; // initialize storedData
			}
			result["storedData"].push( {
				"input": $('#input').val(),
				"pattern": $('#pattern').val(),
				"replace": $('#replace').val()
			
			} );
			chrome.storage.local.set(result, function(){
				console.log( "data saved successfully");
			} );
			
			// reflesh saved replaces
			showSavedReplaces();
		});


	});
	
	/************************* format displayText  ******************************/
	function formatDisplayText(displayText) {
		
		if( displayText.length > 80 ) {
			displayText = displayText.substring( 0, 80 ) + "...";
		}
		displayText = displayText.replace( /\r?\n/g, "<ins><b><i>NL</i></b></ins>" );
		return displayText;
	}
	
	/************************* remove all saved replaces button ******************************/
	$('#remove_saved_replaces').click(function(){
		
		//remove all child element
		$('#saved_replaces').empty();
		
		var data = {};
		data['storedData'] = [];
		chrome.storage.local.set(data, function( result ){
			console.log( "saved replaces removed succesfully");
		});
	});
	
	//************************* bind load and remove event **************************/
	function bindEventToButton( divElem, loadButton, removeButton, index, input, pattern, replace){
		$(divElem).click(function(event){
					$(".bind-button").hide();
					$(loadButton).show();
					$(removeButton).show();
		});
		
		$(loadButton).click(function(event){
			$('textarea').val('');
			$('#input').val( input );
			$('#pattern').val( pattern );
			$('#replace' ).val( replace );
		});
		
		$(removeButton).click(function(event){
			chrome.storage.local.get('storedData', function( result ){
				if (chrome.runtime.lastError) {
					console.log("Runtime error.");
					return;
				}
				
				result['storedData'][index] = null;
					
				chrome.storage.local.set(result, function(){
					console.log( "data saved successfully");
				} );
			
				$(divElem).hide();
			});
		});
	}
	
	/*************************show saved replaces ******************************/
	$('#show_saved_replaces').click(function(){
		
		if( $('#saved_replaces').is(':visible')){
			$('#saved_replaces').hide();
			$('#show_saved_replaces').text('Show Saved Replaces');
			return;
		}
		showSavedReplaces();
		
		$('#saved_replaces').show();
		$('#show_saved_replaces').text('Hide Saved Replaces');
	});
	
	
	function showSavedReplaces(){
		//remove all child element
		$('#saved_replaces').empty();
		
		chrome.storage.local.get('storedData', function( result ){
			if (chrome.runtime.lastError) {
				console.log("Runtime error.");
				return;
			}
			console.log( result ); 
			if( !result.hasOwnProperty( "storedData" )){
				return;
			}
			
			var i;
			var divElems = document.createElement("div");
			for( i = result['storedData'].length ; i >= 0; i-- ){
				var item = result['storedData'][i];
				
				if( !item ) continue;
				
				var displayText = "Input: " + formatDisplayText(item.input) + "<br/>Pattern : " + formatDisplayText(item.pattern) + "<br/>Replace With: " + formatDisplayText(item.replace) ;

				displayText = "<p class='pull-left'>" + displayText + "</p>";
				
				var divElem = document.createElement("div");
				divElem.className += " saved_replace clearfix";
				divElem.innerHTML = displayText;
				var divId = "div-load-" + i;
				divElem.setAttribute("id", divId );
				divElems.appendChild(divElem);
				
				
				var removeButton = document.createElement("remove");
				removeButton.setAttribute( "type", "button");
				removeButton.setAttribute("class", "btn btn-primary bind-button  btn-sm pull-right");
				removeButton.setAttribute("style", "margin: 5px;" );
				removeButton.innerHTML = "Remove";
				$(removeButton).hide();
				divElem.appendChild(removeButton);
				
				var loadButton = document.createElement("button");
				loadButton.setAttribute( "type", "button");
				loadButton.setAttribute("class", "btn btn-primary bind-button  btn-sm pull-right");
				loadButton.setAttribute("style", "margin: 5px;" );
				loadButton.setAttribute("id", "load-" + i );
				var loadId = "load-" + i;
				loadButton.innerHTML = "Load";
				$(loadButton).hide();
				divElem.appendChild(loadButton);
				

				
				// need to create a function to avoid closure in a for loop
				// see http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
				bindEventToButton( divElem, loadButton, removeButton, i, item.input, item.pattern,  item.replace  );
			}
			
			$('#saved_replaces').append(divElems);
		});
	}

});