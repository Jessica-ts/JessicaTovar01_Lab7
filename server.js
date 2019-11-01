let express = require("express");
let morgan = require("morgan");
let bodyParser = require('body-parser');
let uuid = require('uuid/v4');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(morgan("dev"));

let post = [
	{
	
		id : uuid(),
    	title : "1st Post",
    	content : "This is the first post on the blog",
    	author : "Ana",
    	publishDate : "2019, 10, 23"

    },
	{
		id : uuid(),
    	title : "2nd Post",
    	content : "This is the second post on the blog",
    	author : "Pedro",
    	publishDate : "2019, 10, 25"
	},
];

app.get("/api/blog-posts", (req, res, next) => {
    return res.status(200).json(post);
});


app.get("/api/blog-post", (req,res) => {
    let author = req.query.author;
    let x;

    if(!author) 
    {
        res.statusMessage = "Missing author in query!";
		return res.status(406).json({
			message : "Missing author in query!",
			status : 406
		});
    }

    for (x in post) 
        if (author == post[x].author) 
            return res.status(200).json(post[x]);
        
    
    res.statusMessage = "Author not found in the list";
    return res.status(404).json({
        message : "Author not found in the list",
        status : 404
    });
});

app.post("/api/blog-posts", jsonParser, (req,res) => {
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = req.body.publishDate;
   

   
    if (title == "" || content == "" || author == "" || date == "") {
        res.statusMessage = "Query not complete!";
        return res.status(406).json({
            message : "Query not complete!",
            status : 406
        });
    }

    let newPost=
    {
    	id : uuid(),
    	title : title,
    	content : content,
    	author : author,
    	publishDate : date,
	};
    
    post.push(newPost);
    return res.status(201).json(post);
});

app.delete("/api/blog-posts/:id", (req, res) => 
{
	let idauthor = req.params.id;
	let x;

   
    for (x in post) {
        if (idauthor == post[x].id) 
        {
            post.splice(x,1);
            return res.status(200).json(
            	{
            		message:"success", status:200
            	});
        }
    }

    res.statusMessage = "ID not found";
    return res.status(404).json({
        message : "ID not found",
        status : 404
    });

});

app.put("/api/blog-posts/:id", jsonParser, (req,res) => {
    let idauthor = req.params.id;
    let blogId = req.body.id;
	let Title = req.body.title;
	let Content = req.body.content;
	let Author = req.body.author;
    let nDate = req.body.publishDate;

    if (!blogId) 
    {
        res.statusMessage = "Missing ID in query!";
        return res.status(406).json({
            message : "Missing ID in query!",
            status : 406
        });
    }

    if (idauthor != blogId) 
    {
        res.statusMessage = "Parameter ID different from body ID!";
        return res.status(409).json({
            message : "Parameter ID different from body ID!",
            status : 409
        });
    }

    var x;
    for (x=0; x<post.length; x++) 
	{
        if (post[x].id == idauthor) {
            if (Title) {
                post[x].title = Title;
            }
            if (Content){
                post[x].content = Content;
            }
            if (Author) {
                post[x].author = Author;
            }
            if (nDate) {
                post[x].publishDate = nDate;
            }
            return res.status(202).json(post[x]);
        }
    }

});


app.listen("8080", () => {
    console.log("App is running on port 8080");
});
