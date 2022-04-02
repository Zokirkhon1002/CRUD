const http = require('http');
const {v4}=require("uuid");
const getBodyData = require("./util");

let books = [
    {id:1,title:"book n1",pages:250,author:"Writer 1"}
]


const server = http.createServer(async (req, res)=> {
    // get All Books
    if(req.url === "/books" && req.method === "GET"){
        res.writeHead(200,{
            "Content-Type": "application/json charset=utf8"
        })
        const resJson = {
            status: "OK",
            books,
        }
        res.end(JSON.stringify(resJson))
    } else if(req.url === "/books" && req.method === "POST"){
        const data = await getBodyData(req);
        const {title, pages, author} = JSON.parse(data);
        const newBook = {
            id: v4(),
            title,
            pages,
            author
        }
        books.push(newBook);
        const resp = {
            status: "Created",
            book: newBook
        }
        res.writeHead(200,{
            "Content-Type": "application/json charset=utf8"
        })
        res.end(JSON.stringify(resp))
    } else if(req.url.match(/\/books\/\w+/)  && req.method === "GET"){
        const ids = req.url.split("/")[2]
        const book = books.find(b=> String(b.id) === String(ids));
        res.writeHead(200,{
            "Content-Type": "application/json charset=utf8"
        })
        const resp = {
            status: "OK",
            book,
        }
        res.end(JSON.stringify(resp))
    } else if(req.url.match(/\/books\/\w+/) && req.method === "PUT"){
        const ids = req.url.split("/")[2];
        const data = await getBodyData(req);
        const {title, pages, author} = JSON.parse(data);
        const index = books.findIndex(b=> b.id === ids);
        const changedBook = {
            id: books[index].id,
            title: title || books[index].title,
            pages: pages || books[index].pages,
            author: author || books[index].author,

        }
        books[index] = changedBook;


        res.writeHead(200,{
            "Content-Type": "application/json charset=utf8"
        })
        const resp = {
            status: "OK",
            book: changedBook
        }
        res.end(JSON.stringify(resp))
    } else if(req.url.match(/\/books\/\w+/) && req.method === "DELETE"){
        const ids = req.url.split("/")[2];
        books = books.filter(b=> b.id !== ids);


        res.writeHead(200,{
            "Content-Type": "application/json charset=utf8"
        })
        const resp = {
            status: "OK",
            book: "deleted"
        }
        res.end(JSON.stringify(resp))
    }
})


let PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> {
    console.log(`server running on port: ${PORT}`)
})