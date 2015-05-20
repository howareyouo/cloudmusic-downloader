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

chrome.runtime.onMessage.addListener(function(data) {
	console.log(data)
	data.songs.forEach(function(song, i) {
		song = song[data.type]
		chrome.downloads.download({ url : song.url, filename : song.name + '.' + song.extension }, function(id) {
			console.log(id)
		})
	})
})

var qualities = [ 'hMusic', 'mMusic', 'bMusic', 'lMusic' ]