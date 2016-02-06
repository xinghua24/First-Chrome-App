"use strict";

(function(){
	new Clipboard('#copy_button');
})();
	
$(document).ready(function(){
	$('#runReplace').click(function(){
		var re = new RegExp( $('#regex').val(), 'g');
		var result = $('#input').val().replace( re, $('#replace').val() );
		$('#output').text(result);
	});
	
	$('#copytoclipboard').click(function(){

	});
	
	$('#clean').click(function(){
		$('textarea').text('');
		$('textarea').val('');
	});
	
	$('#save').click(function(){
		if( $('#input').val() === '' && $('#regex').val() === '' && $('#replace').val() === '' )
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
				"regex": $('#regex').val(),
				"replace": $('#replace').val()
			
			} );
			chrome.storage.local.set(result, function(){
				console.log( "data saved successfully");
			} );
			
		});

	});
	
	function displayNewLineSymbol(s) {
		return s.replace( /\r?\n/g, "<i style=\"background-color:#CCC\">NL</i>" );
	}
	
	
	$('#remove_saved_replaces').click(function(){
		
		//remove all child element
		$('#saved_replaces').empty();
		
		var data = {};
		data['storedData'] = [];
		chrome.storage.local.set(data, function( result ){
			console.log( "saved replaces removed succesfully");
		});
	});
	
	
	$('#show_saved_replaces').click(function(){
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
			
			for( var i = result['storedData'].length ; i >= 0; i-- ){
				var item = result['storedData'][i];
				if( !item ) continue;
				
				var displayText = "Regex : " + displayNewLineSymbol(item.regex) + " Replace With: " + displayNewLineSymbol(item.replace);
				
				var divElem = document.createElement("div");
				
				divElem.innerHTML = displayText;
				
				$('#saved_replaces').append(divElem);
			}
		});
	});
	

});