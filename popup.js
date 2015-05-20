function $(id) { return document.getElementById(id) }
// http://music.163.com/api/song/detail?id=28793502&ids=[28793502]
function ajax(method, url, success, fail) {
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200)
				success(xmlhttp.responseText)
			else
				fail(xmlhttp.responseText)
		}
	}
	xmlhttp.open(method.toUpperCase(), url, true);
	xmlhttp.send(null)
	return xmlhttp
}
// http://m1.music.126.net/FCuiYDYfOjQggWjUtKerxw==/5934064255477633.mp3
chrome.runtime.onMessage.addListener(function(msg) {
	ajax('GET', 'http://music.163.com/api/song/detail?ids=[' + msg.ids[0] + ']', function(data) {
		data = JSON.parse(data)
		var songinfo = data.songs[0]
		var song = songinfo.hMusic || songinfo.mMusic || songinfo.bMusic || songinfo.lMusic
		var song_name = song.dfsId
		var downloadUrl = 'http://m1.music.126.net/' + encrypt(song.dfsId) + '/' + song.dfsId + '.' + song.extension
		console.log(songinfo)
		console.log(downloadUrl)
		chrome.downloads.download({ url : downloadUrl, filename : song.name + '.' + song.extension }, function(id) {
			console.log(id)
		})
	})
})
function encrypt(dfsid) {
	dfsid += ''
	var key = '3go8&$8*3*3h0k(2)2', arr = []
	for (var i = 0, len = dfsid.length; i < len; i++)
		arr[i] = dfsid.charCodeAt(i) ^ key.charCodeAt(i % key.length)
	return b64_md5(bin2String(arr)) + '=='
}
document.addEventListener('DOMContentLoaded', function() {
	var btns = document.getElementsByTagName('button');
	[].slice.call(btns).forEach(function(elem, i) {
		elem.addEventListener('click', function(e) {
			// chrome.runtime.sendMessage({ action : "start" }, function(response) { console.log(response.farewell) }) 
			chrome.windows.getCurrent(function(currentWindow) {
				chrome.tabs.query({ active : true, windowId : currentWindow.id }, function(activeTabs) {
					chrome.tabs.executeScript(activeTabs[0].id, { file : 'content.js', allFrames : false })
				})
			})
		}, false)
	})
})