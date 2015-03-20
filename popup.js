String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s$)/, '')
}
function $(id) {
	return document.getElementById(id)
}
function param(url, name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(url) || [ , '' ])[1].replace(
	        /\+/g, '%20'))
	        || null
}
function replaceParam(url, name, value) {
	var reg = new RegExp('(' + name + '=).*?(&|$)')
	if (url.search(reg) >= 0)
		return url.replace(reg, '$1' + value + '$2');
	else
		return url + (url.indexOf('?') > 0 ? '&' : '?') + name + '=' + value
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
function showTips(text, clazz) {
	var tips = $('tips')
	tips.innerText = text
	tips.className = clazz
	tips.style.display = 'inline-block'
}
function downloadLinks(links) {
	links.forEach(function(link) {
		chrome.downloads.download({ url : link }, function(id) {
			console.log('download ' + (id ? ('id : ' + id) : ('failed : ' + link)))
		})
	})
}
// http://music.163.com/api/song/detail?id=28793502&ids=[28793502]
function ajax(method, url, success, fail){
	var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function(){  
		if (xmlhttp.readyState == 4){
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
// window.md5('aaa')
// Base64.encode('小飼弾');    // 5bCP6aO85by+
// Base64.decode('5bCP6aO85by+');  // 小飼弾
// http://m1.music.126.net/FCuiYDYfOjQggWjUtKerxw==/5934064255477633.mp3
chrome.runtime.onMessage.addListener(function(msg) {
	var id = msg.ids[0]
	ajax('GET', 'http://music.163.com/api/song/detail?id=' + id + '&ids=[' + id + ']', function (data) {
		data = JSON.parse(data)
		if (data.songs && data.songs.length)
		var songinfo = data.songs[0]
		var song = songinfo.hMusic || songinfo.mMusic || songinfo.bMusic || songinfo.lMusic
		var song_name = song.dfsId
		var downloadUrl = 'http://m1.music.126.net/' + encrypt(song.dfsId) + '/' + song.dfsId + '.mp3'
		window.open(downloadUrl)
	})
})
/*
Cryptojs 用法:
var hash = CryptoJS.MD5(b).toString()
var words  = CryptoJS.enc.Base64.parse('SGVsbG8sIFdvcmxkIQ==');
var base64 = CryptoJS.enc.Base64.stringify(words);
*/
function encrypt(dfsid) {
	var aa='3go8&$8*3*3h0k(2)2';
	var a=[];
	console.log(aa[0])
	console.log(aa.charCodeAt(0))
	for(var i=0;i<aa.length;i++){
		a.push(aa.charCodeAt(i));
	}
	var b = [];
	for(var i=0;i<dfsid.length;i++){
		b.push(dfsid.charCodeAt(i));
	}
	console.log(b)
	for (var i = 0; i < b.length; i++) {
		b[i] = b[i] ^ a[i % a.length]
	}
	var hash = CryptoJS.MD5(b)
	console.log(hash)
	console.log(hash.toString())
	var base = CryptoJS.enc.Base64.stringify(hash)
	console.log(base)
	return base
}
document.addEventListener('DOMContentLoaded', function() {
	$('start').addEventListener('click', function(e) { // 开始下载
		/*
	 		chrome.runtime.sendMessage({ action : "start" }, function(response) {
	 		console.log(response.farewell); });
		*/
		chrome.windows.getCurrent(function(currentWindow) {
			chrome.tabs.query({ active : true, windowId : currentWindow.id }, function(activeTabs) {
				chrome.tabs.executeScript(activeTabs[0].id, { file : 'content.js', allFrames : false })
			})
		})
	}, false)
})