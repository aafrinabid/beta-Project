const express=require('express');
const app=express()
const pool=require('./db');

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/todos/:id',async(req,res)=>{
    const {id}=req.params
    try{
        const todo=await pool.query('SELECT todo_list.*,fav.description FROM todo_list INNER JOIN fav ON todo_id=fav.id AND todo_id=$1',[id]);
        res.json(todo.rows[0]);
    }
    catch(err){
        console.log(err.message)
        
    }
})


app.post('/todos',async(req,res)=>{
    try{
         const {description}=req.body
         const {fav}=req.body
         const newTodo=await pool.query("INSERT INTO todo_list(description) VALUES ($1) RETURNING todo_id",
         [description]);
         const fId=newTodo.rows[0].todo_id;
         const newFav=await pool.query('INSERT INTO fav(id,description) VALUES($1,$2) RETURNING *',
         [fId,fav]);
         res.json(newFav.rows[0]);
    }
    catch(err){
 console.error(err.message)
    }
 });







 app.listen(3000,()=>{
    console.log('listening at 3000')
})


