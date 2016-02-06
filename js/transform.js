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
});