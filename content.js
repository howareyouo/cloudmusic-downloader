chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	// if (request.greeting == "hello") sendResponse({ farewell : "goodbye" })
	console.log(request)
	console.log(sender)
})
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
function encrypt(dfsid) {
	dfsid += ''
	var key = '3go8&$8*3*3h0k(2)2', arr = []
	for (var i = 0, len = dfsid.length; i < len; i++)
		arr[i] = dfsid.charCodeAt(i) ^ key.charCodeAt(i % key.length)
	return b64_md5(bin2String(arr)) + '=='
}
var action_bar = document.getElementsByClassName('j-action')[0]
if (action_bar) {
	var hash = top.location.hash,
		arr = /(\w*)\?id=(\d+)/.exec(hash),
		qualities = [ 'hMusic', 'mMusic', 'bMusic', 'lMusic' ];
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
				var elements = document.getElementById('m-song-list-module').querySelectorAll('tr')
				for (var i = 0, len = elements.length; i < len; i++)
					msg.ids.push(elements[i].dataset.id)
				break
		}
		ajax('GET', 'http://music.163.com/api/song/detail?ids=[' + msg.ids + ']', function(data) {
			songs = JSON.parse(data).songs
			songs.forEach(function(song) {
				qualities.forEach(function(type) {
					song[type].url = 'http://m1.music.126.net/' + encrypt(song[type].dfsId) + '/' + song[type].dfsId + '.' + song[type].extension
				})
			})
			switch(msg.type) {
			case 'song' :
				var song = songs[0] // window.open(\'' + song.mp3Url + '\')
				action_bar.insertAdjacentHTML('beforeend', '<a href="javascript:;" class="u-btni u-btni-dl j-dl" hidefocus="true" title="下载"><i>下载</i><ul class="dropdown"><li title="hMusic">320Kbps</li><li title="mMusic">160Kbps</li><li title="lMusic">96Kbps</li></ul></a>');
				break
			case 'album':
			case 'playlist':
			}
			var btn = document.querySelector('a.u-btni-dl')
			btn.addEventListener('mouseover', function(e) {
				btn.getElementsByTagName('ul')[0].style.display = 'block'
			}, false)
			btn.addEventListener('mouseout', function(e) {
				btn.getElementsByTagName('ul')[0].style.display = 'none'
			}, false)
			var lis = document.querySelectorAll('.dropdown li');
			[].slice.call(lis).forEach(function(li, i) {
				li.onclick = function(){
					songs.forEach(function(song, j){
						window.open(song[li.title].url)
					})
				}
			})
		})
	}
}