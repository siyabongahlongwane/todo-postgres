const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || '5000';
const pool = require('./db');
app.listen(port, () => {
    console.log('App started on port ' + port);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors({ origin: '*' }));

// get all todos
app.get('/getTodos', async (req, res) => {
    try {
        const todos = await pool.query('SELECT * FROM todo');
        res.send(todos['rows']);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// get single todo
app.get('/getTodo/:id', async (req, res) => {
    let { id } = req.params;
    let todo = await getTodo(id, res);
    try {
        if (todo.length) {
            res.send(todo[0]);
        } else {
            res.status(400).send({ err: 'Todo id does not exist' });
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// add new todo 
app.post('/addTodo', async (req, res) => {
    try {
        let newTodoKeys = Object.keys(req.body).join(',');
        let newTodoValues = Object.values(req.body).map(val => `'${val}'`);
        let newTodo = await pool.query(`INSERT INTO todo(${newTodoKeys}) VALUES(${newTodoValues.join(',')})`);
        if (newTodo) res.send({ msg: "Todo added successfully" });
        else {
            res.status(400).send({ err: "Error adding todo" })
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
})

// update to do
app.put('/updateTodo/:id', async (req, res) => {
    let { id } = req.params;
    let todo = await getTodo(id, res);
    try {
        if (todo.length) {
            let assignmentStringArr = [];
        Object.entries(req.body).forEach(([key, value]) => {
            if (key === 'todoid') {
                temp = `${key}=${value}`
            } else {
                temp = `${key}='${value}'`
            }
            assignmentStringArr.push(temp);
        });
        assignmentStringArr.join('');
        await pool.query(`UPDATE todo SET ${assignmentStringArr} WHERE todoid=${id}`);
        res.send({ msg: "Todo updated successfully!" });
        } else {
        res.status(400).send({ err: 'Todo id does not exist' });
            
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
})

const getTodo = async (id, res) => {
    try {
        const todo = await pool.query(`SELECT * FROM todo WHERE todoid='${id}'`);
        return todo['rows'];
    } catch (err) {
        res.status(400).send(err.message);
    }
}

app.delete('/deleteTodo/:id', async(req, res) => {
    let { id } = req.params;
    let todo = await getTodo(id, res);
    try {
        if (todo.length) {
            await pool.query(`DELETE FROM todo WHERE todoid=${id}`);
            res.send({msg: 'Todo successfully deleted'})
        } else {
            res.status(400).send({ err: 'Todo id does not exist' });
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
})