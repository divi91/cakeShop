var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var session = require('express-session');
const port = process.env.port || 5000;
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');


app.use(fileUpload({ safeFileNames: true, preserveExtension: true }))


app.use(session({secret: 'this is secret'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

var cakes = [];

var server = require('http').createServer(app);

var sess;

app.get('/',function(req,res){
	res.sendFile(__dirname + '/views/cakes.html');
});

app.get('/productDisplay',function(req,res){
	res.sendFile(__dirname + '/views/cakes.html');
});


app.get('/images',function(req,res){
	cakes = [];
	populateCake();
	res.json(cakes);
});
app.get('/validateSession',function(req,res){
	sess = req.session;
	
	if(sess!='undefined' && sess.username=='rohit')
	{
		res.sendStatus(200);
	}
	else
	{
		res.sendStatus(400);
	}
});

app.get('/orders',function(req,res){
	sess = req.session;
	
	if(sess!='undefined' && sess.username=='rohit')
	{
		res.sendFile(__dirname + '/views/orders.html');	
	}
	else
	{
		res.redirect('/inventory');
	}
	
});

app.get('/ordersdata',function(req,res){
	sess = req.session;
	
	if(sess!='undefined' && sess.username=='rohit')
	{
		
		var currentOrders = fs.readFileSync(__dirname + '/database/Orders.json');
		var array = []
		if(currentOrders.length>0)
		{
			array = JSON.parse(currentOrders);	
		}
		res.json(array);
	
	}
	else
	{
		res.redirect('/inventory');
	}
	
});

app.post('/checkout',function(req,res){
	saveToFile(req.body);
	res.sendStatus(201);
});


app.post('/deleteOrders',function(req,res){
	sess = req.session;
	
	if(sess!='undefined' && sess.username=='rohit')
	{
		updateOrders(req.body);
		res.redirect('/orders');	
	}
	else
	{
		res.redirect('/inventory');	
	}
	
});

app.get('/inventory',function(req,res){
	res.sendFile(__dirname + '/views/inventory.html');	
});

app.post('/inventory',function(req,res){
	var body = req.body;
	if(body.username=="rohit" && body.password=="Cake!123")
	{
		sess = req.session;
		sess.username = body.username;
		res.redirect('/inventory');
	} 
	else
	{
		res.sendStatus(400);
	}
	
});

app.get('/logout', function(req,res){
	req.session.destroy((err) => {
        if(err) {
            console.log(err);
        }
 });
	res.sendStatus(200);
});

app.post('/upload',function(req,res){
	sess = req.session;
	if(sess!='undefined' && sess.username=='rohit')
	{
		let file = req.files.cakeFileUpload;
		var filename = file.name ;
		if(path.extname(file.name) =='.peg')
		{
			var basePath = path.basename(file.name);
			filename = basePath.substring(0,basePath.indexOf(".")-1) + '.jpeg';
			console.log(filename);
		}

		file.mv(__dirname + '/static/images/'+filename, function(err){
			if(err){
	            res.sendStatus(500);
        	} 
        	else {
            res.redirect('/inventory');
        	} 
		});
		
	}
});

app.get('/delete',function(req,res){
	sess = req.session;
	if(sess!='undefined' && sess.username=='rohit')
	{
		var filePath = __dirname + '/static/images/'+req.query.cakeName;
		fs.unlinkSync(filePath);
		res.redirect('/inventory');	
	}
	
});

function populateCake()
{
	fs.readdirSync(__dirname + '/static/images/').forEach(file => {
  		var extn = path.extname(file).substr(1); 
  		if(extn =='jpg' || extn == 'png' || extn =='jpeg')
  		{
  			cakes.push(file);	
  		}
  	});
}

function saveToFile(data)
{
	var currentOrders = fs.readFileSync(__dirname + '/database/Orders.json');
	var array = []
	if(currentOrders.length>0)
	{
		array = JSON.parse(currentOrders);	
	}
	data.forEach(row => { array.push(row)});
	fs.writeFileSync(__dirname + '/database/Orders.json', JSON.stringify(array));
	
}

function updateOrders(data)
{
	fs.writeFileSync(__dirname + '/database/Orders.json', JSON.stringify(data));
}

console.log("Server started.");

server.listen(process.env.PORT || 5000, () => console.log(`Listening on ${ port }`));
