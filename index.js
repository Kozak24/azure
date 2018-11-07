var express = require("express");
var bodyParser = require("body-parser");
 
var app = express();
 
var urlencodedParser = bodyParser.urlencoded({extended: false});

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;  

var config = 
   {
     userName: 'kozak', // update me
     password: 'Ebosut99', // update me
     server: 'kozaksql2.database.windows.net', // update me
     options: 
        {
           database: 'KozakSQL' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

	connection.on('connect', function(err) 
		{
		 if (err) 
		   {
			  console.log(err)
		   }
		else
		   {
			   //
		   }
		}
	);

app.use(express.static(__dirname + "/public"));
 
app.post("/register", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    //response.send(`${request.body.userName} - ${request.body.userLastName}`);
	executeStatement1(request.body.userName, request.body.userLastName);
});
 
app.get("/", function(request, response){
		//response.send('Ok');
		queryDatabase(response);

});
 
function queryDatabase(response)
{ console.log('Reading rows from the Table...');
  let result = '<table border="1"><tr><th>Id</th><th>First name</th><th>Last name</th></tr>';
	
       // Read all rows from table
     request = new Request(
          "SELECT * FROM PERSON",
             function(err, rowCount, rows) 
                {
				console.log("%s\t", result);
				result += '</table>';
                    console.log(rowCount + ' row(s) returned');
					response.send(result);
                }
            );

     request.on('row', function(columns) {
		result += '<tr>';
        columns.forEach(function(column) {
			// Column name and column value
			//result += `${column.metadata.colName}  ${column.value} `;
			
			//Column value only
			result += '<th>';
			result += `${column.value}`;
			result += '</th>'
			
			//For debug
            //console.log("%s\t%s", column.metadata.colName, column.value);
         });
		 result += '</tr>';
    });
    connection.execSql(request);
}

function executeStatement1(firstName, lastName) {  
        request = new Request("INSERT INTO PERSON (FirstName, LastName) VALUES (@firstName, @lastName)", function(err) { 
		if (err) {  
            console.log(err);}  
        });  
        request.addParameter('firstName', TYPES.NVarChar , firstName);  
        request.addParameter('lastName', TYPES.NVarChar, lastName);
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                console.log("Person id of inserted item is " + column.value);  
              }  
            });  
        });       
        connection.execSql(request);  
    }  
 
var port = process.env.PORT || 1337;
app.listen(port);