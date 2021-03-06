function changeServer(obj) {
	if (obj.options[obj.selectedIndex].value != '') {
		window.location = 'index.php?server='
				+ obj.options[obj.selectedIndex].value;
	} else {
		window.location = 'index.php';
	}
}
function changeCluster(obj) {
	if (obj.options[obj.selectedIndex].value != '') {
		window.location = 'stats.php?cluster='
				+ obj.options[obj.selectedIndex].value;
	} else {
		window.location = 'stats.php';
	}
}
function show(target)
{
	var objects = document.getElementsByClassName(target);
	for(i = 0 ; i < objects.length ; i++){
		objects[i].style.display = '';
	}
}
function hide(target)
{
	var objects = document.getElementsByClassName(target);
	for(i = 0 ; i < objects.length ; i++){
		objects[i].style.display = 'none';
	}
}

function changeCommand(obj) {
	document.getElementById('request_key').value = '';
	document.getElementById('request_duration').value = '';
	document.getElementById('request_data').value = '';
	document.getElementById('request_delay').value = '';
	document.getElementById('request_value').value = '';
	var command = obj.options[obj.selectedIndex].value;
	var div_key = document.getElementById('div_key');
	var div_duration = document.getElementById('div_duration');
	var div_data = document.getElementById('div_data');
	var div_delay = document.getElementById('div_delay');
	var div_value = document.getElementById('div_value');
	if (command == 'get' || command == 'delete') {
		div_key.style.display = '';
		div_duration.style.display = 'none';
		div_data.style.display = 'none';
		div_delay.style.display = 'none';
		div_value.style.display = 'none';
	} else if (command == 'set') {
		div_key.style.display = '';
		div_duration.style.display = '';
		div_data.style.display = '';
		div_delay.style.display = 'none';
		div_value.style.display = 'none';
	} else if (command == 'flush_all') {
		div_key.style.display = 'none';
		div_duration.style.display = 'none';
		div_data.style.display = 'none';
		div_delay.style.display = '';
		div_value.style.display = 'none';
	} else if (command == 'increment' || command == 'decrement') {
		div_key.style.display = '';
		div_duration.style.display = 'none';
		div_data.style.display = 'none';
		div_delay.style.display = 'none';
		div_value.style.display = '';
	} else {
		div_key.style.display = 'none';
		div_duration.style.display = 'none';
		div_data.style.display = 'none';
		div_delay.style.display = 'none';
		div_value.style.display = 'none';
	}
}
function executeClear(target) {
	var object = document.getElementById(target);
	object.innerHTML = '';
}
function executeCommand(target) {
	if (document.getElementById('request_command').value != '') {
		var request_url = 'commands.php?request_command='
				+ document.getElementById('request_command').value
				+ '&request_key='
				+ document.getElementById('request_key').value
				+ '&request_duration='
				+ document.getElementById('request_duration').value
				+ '&request_data='
				+ document.getElementById('request_data').value
				+ '&request_delay='
				+ document.getElementById('request_delay').value
				+ '&request_value='
				+ document.getElementById('request_value').value
				+ '&request_server='
				+ document.getElementById('request_server').value
				+ '&request_api='
				+ document.getElementById('request_api').value;
		execute(request_url, target, true);
	}
}
function searchKey(target) {
	if (document.getElementById('search_key').value != '') {
		var request_url = 'commands.php?request_command=search'
				+ '&request_key=' + document.getElementById('search_key').value
				+ '&request_server='
				+ document.getElementById('search_server').value;
		execute(request_url, target, true);
	}
}
function executeTelnet(target) {
	if (document.getElementById('request_telnet').value != '') {
		var request_url = 'commands.php?request_command=telnet'
				+ '&request_telnet='
				+ document.getElementById('request_telnet').value
				+ '&request_server='
				+ document.getElementById('request_telnet_server').value;
		execute(request_url, target, true);
	}
}
function execute(url, target, append) {
	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			onExecute(target, append);
		};
		req.open('GET', url, true);
		req.send(null);
	} else if (window.ActiveXObject) {
		req = new ActiveXObject('Microsoft.XMLHTTP');
		if (req) {
			req.onreadystatechange = function() {
				onExecute(target, append);
			};
			req.open('GET', url, true);
			req.send();
		}
	}
}
function onExecute(target, append) {
	if (req.readyState == 1) {
		document.getElementById('loading').style.visibility = "visible";
	} else if (req.readyState == 4) {
		document.getElementById('loading').style.visibility = "hidden";
		if (req.status == 200 || req.status == 304) {
			if (append == true) {
				var object = document.getElementById(target);
				object.innerHTML += req.responseText;
				object.scrollTop = object.scrollHeight;
			} else {
				var object = document.getElementById(target);
				object.innerHTML = req.responseText;
				object.scrollTop = object.scrollHeight;
			}
		}
	} else {
		document.getElementById('loading').style.visibility = "hidden";
	}
}
var server_id = 1;
var cluster_id = 1;
function addCluster() {
	var clusterDiv = document.createElement('div');
	cluster_id++;
	clusterDiv.innerHTML = '<hr/><strong>Cluster '
			+ '<input type="text" style="width:200px;" name="cluster['
			+ cluster_id
			+ ']" value=""/></strong>'
			+ '<div style="margin-left:40px;margin-top:6px;" id="cluster_'
			+ cluster_id
			+ '_commands"><a class="list button" href="javascript:addServer('
			+ cluster_id
			+ ')">'
			+ 'Add New Server to Cluster</a> <a class="list" style="padding:1px 2px;-moz-border-radius:3px;-webkit-border-radius:3px;" '
			+ 'href="#" onclick="deleteServerOrCluster(\'cluster_' + cluster_id
			+ '\')">Delete Cluster</a></div><br/>';
	clusterDiv.setAttribute('id', 'cluster_' + cluster_id);
	document.getElementById('server_form').appendChild(clusterDiv);
}
function addServer(current_cluster_id) {
	var serverDiv = document.createElement('div');
	server_id++;
	serverDiv.innerHTML = '<div id="server_'
			+ server_id
			+ '"><div style="margin-left:40px;margin-top:3px;">'
			+ '<input type="text" style="width:200px;" name="server['
			+ current_cluster_id
			+ ']['
			+ server_id
			+ '][hostname]" value="hostname" onfocus="hostnameOnFocus(this)" onblur="hostnameOnBlur(this)"/> '
			+ '<input type="text" style="width:50px;" name="server['
			+ current_cluster_id
			+ ']['
			+ server_id
			+ '][port]" value="port" onfocus="portOnFocus(this)" onblur="portOnBlur(this)"/> '
			+ '<a class="list button" style="padding:1px 2px;" href="#" onclick="deleteServerOrCluster(\'server_'
			+ server_id + '\')">Delete</a>' + '</div></div>';
	serverDiv.setAttribute('id', 'server_' + server_id);
	document.getElementById('cluster_' + current_cluster_id).insertBefore(
			serverDiv,
			document.getElementById('cluster_' + current_cluster_id
					+ '_commands'));
}
function deleteServerOrCluster(divID) {
	var div = document.getElementById(divID);
	div.parentNode.removeChild(div);
}
function hostnameOnFocus(obj) {
	if (obj.value == 'hostname') {
		obj.value = '';
	}
}
function hostnameOnBlur(obj) {
	if (obj.value == '') {
		obj.value = 'hostname';
	}
}
function portOnFocus(obj) {
	if (obj.value == 'port') {
		obj.value = '';
	}
}
function portOnBlur(obj) {
	if (obj.value == '') {
		obj.value = 'port';
	}
}
function ajax(url, target) {
	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			ajaxDone(target);
		};
		req.open("GET", url, true);
		req.send(null);
	} else if (window.ActiveXObject) {
		req = new ActiveXObject('Microsoft.XMLHTTP');
		if (req) {
			req.onreadystatechange = function() {
				ajaxDone(target);
			};
			req.open("GET", url, true);
			req.send();
		}
	}
	setTimeout("ajax(page, 'stats')", timeout);
}
function ajaxDone(target) {
	if (req.readyState == 4) {
		if (req.status == 200 || req.status == 304) {
			results = req.responseText;
			document.getElementById(target).innerHTML = results;
		} else {
			document.getElementById(target).innerHTML = "Loading stats error : "
					+ req.statusText;
		}
	}
}