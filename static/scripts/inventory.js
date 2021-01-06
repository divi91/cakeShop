var inventoryLoginForm = document.getElementById('inventoryLoginForm');
var inventoryUserName = document.getElementById('inventoryUserName');
var inventoryPassword = document.getElementById('inventoryPassword');
var loginArea = document.getElementById('loginArea');
var inventoryManagementArea = document.getElementById('inventoryManagementArea');
var cakeUploadForm = document.getElementById('cakeUploadForm');
var btnLogout = document.getElementById('btnLogout');
var divAdminPageButtons = document.getElementById('divAdminPageButtons');
var inventoryp = document.getElementById('inventoryp');

/*
inventoryLoginForm.onsubmit = function(e){
		e.preventDefault();
		var xhr = new window.XMLHttpRequest();
		xhr.open('POST','',false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
		var requestBody = '{ "username":"'+ inventoryUserName +'", "password":"'+ inventoryPassword + '"}' 
		xhr.send(JSON.stringify(requestBody));
		if(xhr.status ==200)
		{
			alert('logged in');
		}
	}
	*/

function documentLoadFunction()
{
	var xhr = new window.XMLHttpRequest();
	xhr.open('get','/validateSession',false);
	xhr.send();
	if(xhr.status ==200)
	{
		loginArea.hidden = true;
		inventoryManagementArea.style.visibility = "visible";
		btnLogout.style.visibility = "visible" ;
		divAdminPageButtons.style.visibility = "visible"; 
		inventoryp.style.visibility = "visible"; 
	}
	else
	{
		loginArea.hidden = false;
		inventoryManagementArea.style.visibility = "hidden";
		btnLogout.style.visibility = "hidden";	
		divAdminPageButtons.style.visibility = "hidden";	
		inventoryp.style.visibility = "hidden";	
	}
	
}	

inventoryLoginForm.onsubmit = function(e){
		e.preventDefault();
		
		var requestBody ={
            "username":inventoryUserName.value,
            "password":inventoryPassword.value
        };

        var xhr = new window.XMLHttpRequest();
		xhr.open('POST','',false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
		var requestBody ={
            "username":inventoryUserName.value,
            "password":inventoryPassword.value
        };
        xhr.send(JSON.stringify(requestBody));
        if(xhr.status ==200)
		{
			loginArea.hidden = true;
			inventoryManagementArea.style.visibility = "visible";
			btnLogout.style.visibility = "visible"
			divAdminPageButtons.style.visibility = "visible"; 
			inventoryp.style.visibility = "visible"; 
		}
		else
		{
			alert('incorrect Username or password');
		}
	}

btnOrders.onclick = function(e)
{
	window.location.replace("/orders");
}

btnBrowse.onclick = function(e)
{
	window.location.replace("/");
}

btnLogout.onclick = function(e)
{
	e.preventDefault();
	var xhr = new window.XMLHttpRequest();
	xhr.open('get','/logout',false);
	xhr.send();
	console.log(xhr.status);
	location.reload();
}


	//cakeUploadForm.onsubmit = function(e)
	//{

	//}
