// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
	// Replace all rules ...
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		// With a new rule ...
		chrome.declarativeContent.onPageChanged.addRules([ {
		    // That fires when a page's URL contains a 'g' ...
		    conditions : [ new chrome.declarativeContent.PageStateMatcher({
			    pageUrl : { hostEquals : 'music.163.com' }
		    }) ],
		    // And shows the extension's page action.
		    actions : [ new chrome.declarativeContent.ShowPageAction() ]
		} ])
	})
})
chrome.runtime.onMessage.addListener(function(songs) {
	console.log(songs)
    
	songs.forEach(function(song, i) {
		var song = getHighestQualitySong(song)
		chrome.downloads.download({ url : song, filename : song.name + '.' + song.extension }, function(id) {
			console.log(id)
		})
	})
})
var qualities = [ 'hMusic', 'mMusic', 'bMusic', 'lMusic' ]
