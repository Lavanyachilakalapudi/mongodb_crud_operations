
var express=require('express');
var app=new express();
var bodyParser=require('body-parser');
app.set("view engine","pug");

var monogodb=require('mongodb');
var MongoClient=monogodb.MongoClient;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.get("/home",function(req,res)
{
    var connection=new MongoClient("mongodb://127.0.0.1:27017");

    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('internship');
            db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    res.render("table",{unicorns:data})
                    con.close();
                }
            })
        }
    })
})
app.get("/delete/:key",function(req,res)
{
    var connection=new MongoClient("mongodb://127.0.0.1:27017");

    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('internship');
            db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    var ind=req.params.key;
                    console.log(ind);
                    var temp={name:data[ind].name};
                    console.log(temp);
                    db.collection('unicorns').deleteOne(temp,function(err,data)
                    {
                        if(err)
                        {
                            console.log("err",err);
                        }
                        else{
                            console.log(data);
                            res.redirect("/home");
                            con.close();
                        }
                    });
                }
            })
        }
    })
})
app.get("/edit/:key",function(req,res)
{
    var connection=new MongoClient("mongodb://127.0.0.1:27017");
    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('internship');
            db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    res.render("edit",{unicorns:data,index:req.params.key})
                    con.close();
                }
            })
        }
    })
})
app.post("/update/:key",function(req,res)
{
    var connection=new MongoClient("mongodb://127.0.0.1:27017");

    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('internship');
            db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    var ind=req.params.key;
                    var temp={name:data[ind].name};
                    var a=req.body.loves;
                    var t=a.split(",");
                    var newdetails={$set:{name:req.body.name,dob:req.body.dob,loves:t,weight:req.body.weight,gender:req.body.gender,vampires:req.body.vampires}};
                    db.collection('unicorns').updateOne(temp,newdetails,function(err,data)
                    {
                        if(err)
                        {
                            console.log("update error::",err);
                        }
                        else{
                            res.redirect("/home");
                            con.close();
                        }
                    })
                }
            })
        }
    })
})
app.get("/add",function(req,res)
{
    res.render("insert");
})
app.post("/insert",function(req,res)
{
    var connection=new MongoClient("mongodb://127.0.0.1:27017");

    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('internship');
            var a=req.body.loves;
            var t=a.split(",");
            var temp={name:req.body.name,dob:req.body.dob,loves:t,weight:req.body.weight,gender:req.body.gender,vampires:req.body.vampires}
            db.collection('unicorns').insertOne(temp,function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    res.redirect("/home");
                    con.close();
                }
            })
        }
    })
})
app.get('/sort/:key',function(req,res){
    var connection=new MongoClient("mongodb://127.0.0.1:27017");
    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('internship');
            db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    
                    data.sort(function(a,b){
                        return a[req.params.key]> b[req.params.key]?1:-1;
                    })
                    res.render("table",{unicorns:data});
                    con.close();
                }
            })
        }
    })

})
app.listen(8080,function(req,res){
    console.log("server is runnin on 8080");
})