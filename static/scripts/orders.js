var maindiv = document.getElementById('maindiv');
var btnLogout = document.getElementById('btnLogout');
var orderTable = document.getElementById('pagetable');

function documentLoadFunction()
{
	let request = new XMLHttpRequest();
    request.open("GET", '/ordersdata',false);
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            var data = JSON.parse(request.responseText);
            displayOrders(data);
        }
    }
    request.send();
	if(request.status ==200)
	{
		btnLogout.setAttribute('style','');
	}
}

function displayOrders(data)
{
	data.forEach(row => {

		var tr = document.createElement("tr"); 
		var td1 = document.createElement("td");
    	var td2 = document.createElement("td");	
    	var td3 = document.createElement("td");
    	var td4 = document.createElement("td");
    	var td5 = document.createElement("td");
    	var td6 = document.createElement("td");

    	var text1 = document.createTextNode(row.name);
		var text2 = document.createTextNode(row.email);
    	var text3 = document.createTextNode(row.number);
    	var text4 = document.createTextNode(row.cakeName);
    	var text5 = document.createTextNode(row.quantity);

    	var input = document.createElement("input");
		input.setAttribute("type","checkbox");
		input.setAttribute("value","0");
		input.setAttribute('onclick',"updateValue(this)");
		

    	td1.appendChild(text1);
    	td2.appendChild(text2);
    	td3.appendChild(text3);
    	td4.appendChild(text4);
    	td5.appendChild(text5);
    	td6.appendChild(input);

    	tr.appendChild(td1);
    	tr.appendChild(td2);
    	tr.appendChild(td3);
    	tr.appendChild(td4);
    	tr.appendChild(td5);
    	tr.appendChild(td6);
    	orderTable.appendChild(tr);	

	})
}

function updateValue(val) {
	if(val.checked)
	val.setAttribute("value","1");
	else
		val.setAttribute("value","0");
}

btnAdmin.onclick = function(e)
{
	window.location.replace("/inventory");
}

btnLogout.onclick = function(e)
{
	e.preventDefault();
	var xhr = new window.XMLHttpRequest();
	xhr.open('get','/logout',false);
	xhr.send();
	location.reload();
}

function deleteOrders()
{
	var orders = [];
	var changed = false
	//first loop is to just traverse the table to see if we have any meaningfull changed to post to server
	for (var i = 1, row; row = orderTable.rows[i]; i++)
	{
		var temporder = {};
		var checkBoxStr = row.cells[5].innerHTML;
		var strarray = checkBoxStr.split(" ")
		var valstr = strarray[2]
		var checkedVal = valstr.substring(valstr.indexOf('"') +1, valstr.lastIndexOf('"')); 
		if(checkedVal=='1')
		{
			changed = true;
			break;
		}
	}

	if(!changed)
	{
		alert('No Order Selected');
		return 0;
	}
	for (var i = 1, row; row = orderTable.rows[i]; i++)
	{
		var temporder = {};
		var checkBoxStr = row.cells[5].innerHTML;
		var strarray = checkBoxStr.split(" ")
		var valstr = strarray[2]
		var checkedVal = valstr.substring(valstr.indexOf('"') +1, valstr.lastIndexOf('"')); 
		if(checkedVal=='0')
		{
			temporder.cakeName = row.cells[3].innerHTML ;
			temporder.quantity = row.cells[4].innerHTML ;
			temporder.name = row.cells[0].innerHTML ;
			temporder.number = row.cells[2].innerHTML ;
			temporder.email = row.cells[1].innerHTML ;
			orders.push(temporder);
		}

		
	}

	var request = new window.XMLHttpRequest();
	request.open("POST",'/deleteOrders');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	request.send(JSON.stringify(orders));
	console.log(request.status);
	location.reload();
	
}