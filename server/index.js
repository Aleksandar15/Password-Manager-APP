const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const PORT = 3001;
require('dotenv').config({ path: './config/dev.env'})

const {encrypt, decrypt} =  require('./EncryptionHandler');

app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    user: MYSQL_USER,
    host: MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

app.post('/addpassword', (req, res) => {
    const {password, title} = req.body;
    const hashedPassword = encrypt (password);
    db.query(
        "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)", 
        [hashedPassword.password,title, hashedPassword.iv],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success!!!");
            }
    });
});

app.get('/showpasswords', (req, res) => {
    db.query("SELECT * FROM passwords;", (err, result) => {
        if (err) {
            console.log(err);
        } else {
        res.send(result);
        }
    })
})

app.post('/decryptpassword', (req, res) => {
    res.send(decrypt(req.body))
})

app.listen(process.env.PORT || PORT, ()=> {
    console.log("This server is running");
});