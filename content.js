var hash_reg = /(\w*)\?id=(\d+)/,
	hash = location.hash,
	arr = hash_reg.exec(hash);
if (arr && arr.length == 3) {
	var type = arr[1],
		id = arr[2],
		msg = { type : type, ids : []}
	switch (type) {
		case 'song' :
			msg.ids.push(id)
			break
		case 'album':
		case 'playlist':
			var elements = frames['contentFrame'].document.getElementById('m-song-list-module').querySelectorAll('tr')
			for (var i = 0, len = elements.length; i < len; i++) {
				msg.ids.push(elements[i].dataset.id)
			}
			break
	}
	chrome.runtime.sendMessage(msg)
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	// if (request.greeting == "hello") sendResponse({ farewell : "goodbye" })
	console.log(request)
	console.log(sender)
})