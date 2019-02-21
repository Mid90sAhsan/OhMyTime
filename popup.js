chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
	console.log( allKeys );
	$('#stored tbody').empty();
	for( var i = 0; i < allKeys.length; i++ ) {
		$('#stored tbody').append( '<tr><td>'+( i + 1 )+'</td><td>'+allKeys[i]+'</td><td>'+ relativeTime( items[ allKeys[i] ] )+'</td></tr>' );
	}
});

function relativeTime( seconds ) {
	if( Math.floor( seconds / 60 ) == 0 )
		return( seconds + "s" );
	else if( Math.floor( seconds / 60 ) > 0 && Math.floor( seconds / 60 ) < 60 ) 
		return( Math.floor( seconds / 60 ) + "m");
	else if( Math.floor( seconds / 3600 ) > 0 && Math.floor( seconds / 3600 ) < 24 ) {
		return( Math.floor( seconds / 3600 ) + "h" );
	}
	else if ( Math.floor( seconds / 86400 ) > 0 && Math.floor( seconds / 86400 ) < 365 ) 	 {
		return( Math.floor( seconds / 86400 ) + "d" );
	}
	else if( Math.floor( seconds / 31536000 ) > 0 ) {
		return( Math.floor( seconds / 31536000 ) + "y" );
	}
}

$('#deletedata').on('click', function() {
	chrome.storage.local.clear(function() {
		var error = chrome.runtime.lastError;
		if (error) {
			console.error(error);
		}
		$('#stored tbody').empty();
	});
});