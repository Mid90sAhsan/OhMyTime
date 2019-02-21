
	var activated_tab_id = 0;
	var timer = 0;
	var currentdomain = "";
	var analysed_time = [];
	var count = 0;
	
	chrome.tabs.onUpdated.addListener(function(id, info, tab) {
		
		if( currentdomain != extractHostname( tab.url ) )  {
			analysed_time = [
				currentdomain,
				timer
			];
			currentdomain = extractHostname( tab.url );
			timer = 0;
		}
		
	});
	
	chrome.tabs.onActivated.addListener(function(info) {
		
		activated_tab_id = info.tabId;
		chrome.tabs.get( info.tabId, function(tab) {
			
			if( ValidURL( extractHostname( tab.url ) ) ) {
				currentdomain = extractHostname( tab.url );
				
				//Start Counting
				count = 1;
				timer = 0;
				
				//Get Local Data
				chrome.storage.local.get([currentdomain], function(result) {
					
					if( result[currentdomain] != undefined ) {
						timer = parseInt( result[currentdomain] );
					}
					
				});
			}
			else {
				count = 0;
				timer = 0;
				chrome.browserAction.setBadgeText({text: ''});
			}
		});
		
		chrome.browserAction.setBadgeText({text: '' + relativeTime( timer )});
	});
	
	setInterval(function(){ 
	  //code goes here that will be run every 1 seconds.    
		if( count == 1 ) {
			
			timer++;
			
			chrome.storage.local.set({[currentdomain]: timer }, function() {
			});
			
			var timertext = "";
			
			
			chrome.browserAction.setBadgeText({text: '' + relativeTime( timer ) });
		}
	}, 1000);
	
	function extractHostname(url) {
		var hostname;
		//find & remove protocol (http, ftp, etc.) and get hostname

		if (url.indexOf("//") > -1) {
			hostname = url.split('/')[2];
		}
		else {
			hostname = url.split('/')[0];
		}

		//find & remove port number
		hostname = hostname.split(':')[0];
		//find & remove "?"
		hostname = hostname.split('?')[0];

		return hostname;
	}
	
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
	
	function ValidURL(str) {
		
		if( str.indexOf('.') > -1) {
			return true;
		} else {
			return false;
		}
	}