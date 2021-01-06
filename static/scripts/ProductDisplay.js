var pUserName = document.getElementById('pUserName');
var btnLogout = document.getElementById('btnLogout');
var cakeArea = document.getElementById('cakeArea');
var sidepanel = document.getElementById('sidepanel');
var table = document.getElementById('pagetable');
var admin ;
var cartDetail = [];
function documentLoadFunction()
{
	var xhr = new window.XMLHttpRequest();
	xhr.open('get','/validateSession',false);
	xhr.send();
	if(xhr.status ==200)
	{
		pUserName.innerHTML = "Hello Admin!";
		btnLogout.setAttribute('style','');
		admin = true;
	}
	else
	{
		pUserName.innerHTML = "Hello Guest !";
	}
	
	let request = new XMLHttpRequest();
    request.open("GET", '/images');
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            var data = JSON.parse(request.responseText);
            displayCakes(data);
        }
    }
    request.send();
}

function openNav() {
	//sidepanel.setAttribute('class','sidePanelOpen');
	
	if(document.getElementById("pagetable").rows.length>1)
	{
		table.setAttribute('style','visibility:true');
		sidepanel.setAttribute('style','visibility:true');
		sidepanel.setAttribute('style','display:visible');
		cakeArea.setAttribute('class','cakeAreaHalf');
	}
	else
	{
		alert('Please add items to cart before visiting');
		cakeArea.setAttribute('class','cakeAreaFull');
		document.getElementById('pagetable').setAttribute('style','display;none');
		sidepanel.setAttribute('style','visibility:hidden');
	}
	
}

function closeNav() {
	cakeArea.setAttribute('class','cakeAreaFull');
	document.getElementById('collapsebutton').setAttribute('style','');
}

btnLogout.onclick = function(e)
{
	e.preventDefault();
	var xhr = new window.XMLHttpRequest();
	xhr.open('get','/logout',false);
	xhr.send();
	location.reload();
}

btnAdmin.onclick = function(e)
{
	window.location.replace("/inventory");
}

function displayCakes(cakes)
{
	cakeArea.innerHTML= "";
	cakes.forEach(c=>{
		var divElement = document.createElement("div")
		divElement.setAttribute("class","cakeImagediv");
		var imgelem = document.createElement("img");
						imgelem.setAttribute("src", "./images/"+c);
						imgelem.setAttribute("id",c);
						imgelem.setAttribute("class","image");

		divElement.appendChild(imgelem)
		var pelem = document.createElement("p");
		pelem.innerHTML = c.substring(0,c.indexOf("."));
		divElement.appendChild(pelem)
		if(admin)
		{
			var delbutton = document.createElement("input");
			delbutton.setAttribute("type","input");
			delbutton.setAttribute("value","Delete");
			delbutton.setAttribute("class","btn");
			delbutton.setAttribute("onclick","deleteCake(" +'"'+c+'"'+");");
			divElement.appendChild(delbutton);	
		}
		else
		{
			var button = document.createElement("input");
			button.setAttribute("type","input");
			button.setAttribute("value","Add To Cart");
			button.setAttribute("class","btn");
			button.setAttribute("onclick","addtoCart(" +'"'+c+'"'+");");
			button.onclick = function() { addtoCart(c);}	;		
			divElement.appendChild(button);
		}
		cakeArea.appendChild(divElement);

			
	});

}

function addtoCart(cakeName)
{
	
	var cake = cakeName.substring(0,cakeName.indexOf("."));
	var tableElement = document.getElementById("pagetable");

		var itemRow = document.createElement('tr'); 
		itemRow.setAttribute("id",cake);

    	var itemtd1 = document.createElement('td');
    	var itemtd2 = document.createElement('td');	
    	var itemtd3 = document.createElement('td');	

    	//add image to the div
		var img = document.createElement("img");
		img.setAttribute("src","./images/"+cakeName);
		img.setAttribute("id",cake);
		img.setAttribute('style','width:100%;height:20%');

		var input = document.createElement("input");
		input.setAttribute("type","text");
		input.setAttribute("id",cake+"input");
		input.setAttribute("name","quantity");
		input.setAttribute("value","1");
		input.setAttribute('style','width:33%');
		input.setAttribute('onchange',"updateValue(this)");
		


		var button = document.createElement("input")
		button.setAttribute("type","input");
		button.setAttribute("value","Delete");
		button.setAttribute("onclick","deleteFromCart(" +'"'+cake+'"'+");");
		button.setAttribute("class","btn");
		button.onclick = function() { deleteFromCart(cake);}	;		
		//button.setAttribute('style','width:33%');

	
	itemtd1.appendChild(img);
	itemtd2.appendChild(input);
	itemtd3.appendChild(button);


	itemRow.appendChild(itemtd1);
    itemRow.appendChild(itemtd2);
    itemRow.appendChild(itemtd3);

    tableElement.appendChild(itemRow);
    
    var elemcustomerForm = document.getElementById('customerForm');
    elemcustomerForm.setAttribute('style','');
    sidepanel.appendChild(elemcustomerForm);
}

function deleteCake(cakeName)
{
	var xhr = new window.XMLHttpRequest();
	xhr.open('get','/delete?cakeName='+cakeName,false);
	xhr.send();
	location.reload();
}

function deleteFromCart(elemId)
{	
	var removeDiv = document.getElementById(elemId);
	removeDiv.innerHTML = "";
	removeDiv.remove();
	var tableElement = document.getElementById("pagetable");
	if(tableElement.rows.length == 1)
	{
		tableElement.setAttribute('style',"display:none");
		sidepanel.setAttribute('style','visibility:hidden');
		cakeArea.setAttribute('class','cakeAreaFull');
		document.getElementById('collapsebutton').setAttribute('style','');	
    }
}

function updateValue(val) {
	val.setAttribute("value",val.value);
}

function checkOut()
{
	cartDetail = [];
	var nameElement = document.getElementById("customername");
	var numberElement = document.getElementById("customernumber");
	var emailElement = document.getElementById("customeremail");
	var tableElement = document.getElementById("pagetable");
	for (var i = 1, row; row = tableElement.rows[i]; i++) {
		//some dirty trick here to extract value out of inner html
		var htmlStr = row.cells[1].innerHTML;
		var strarray = htmlStr.split(" ")
		var valstr = strarray[4] 
		var quantityVal = valstr.substring(valstr.indexOf('"') +1, valstr.lastIndexOf('"'));

		var htmlStrimg = row.cells[0].innerHTML;
		var strarraycake = htmlStrimg.split(" ")
		var valstrcake = strarraycake[2] 
		
		var cakeName = valstrcake.substring(valstrcake.indexOf('"') +1, valstrcake.lastIndexOf('"'));
		
		cartDetail.push({
				cakeName : cakeName,
				quantity : quantityVal,
				name : nameElement.getAttribute("value"),
				number : numberElement.getAttribute("value"),
				email : emailElement.getAttribute("value"),
				status : "New"
			});
		 
	}
	
	if(nameElement.getAttribute("value") == 'Enter Name' && numberElement.getAttribute("value") == 'Enter Number' && emailElement.getAttribute("value") == 'Enter Email')
	{
		alert('Please add name, email or number before checking out !');
		return 0;
	}
	
	var request = new window.XMLHttpRequest();
	request.open("POST",'/checkout',false);
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	request.send(JSON.stringify(cartDetail));
	console.log('response from server is');
	console.log(request.status);
	if(request.status ==201)
	{
		alert('Order Submitted');
		location.reload();
	}
}

