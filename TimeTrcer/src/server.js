const express = require("express");
const crypto = require('crypto');
const fs = require('fs')
const { savePairKey, verifyPairKey } = require('./rsa.js')

const port = process.env.PORT || 3000

let app = new express();
app.use(express.json({ limit: "1mb" }))

let { check } = require("./bot.js");

let noteDB = new Map();

const setNote = function (hash, title, content){
    noteDB.set(hash, {
        title: title,
        content: content,
    });
}
let id = 1;


// Set the flag into note
setNote(crypto.createHash('md5').update(id.toString()).digest('hex'), 'Congrats :)', fs.readFileSync('./flag').toString());

// Created highest-privilege key
const privilegePrivateKey = savePairKey(crypto.createHash('md5').update(id.toString()).digest('hex'));
fs.copyFileSync(`${__dirname}/public_key/${crypto.createHash('md5').update(id.toString()).digest('hex')}.public.pem`,
    `${__dirname}/public_key/highest-privilege.public.pem`)

id ++;


// Main interface
app.get('/', (_, res) =>{
    res.sendFile(__dirname + '/files/index.html');
});

// View interface
app.get('/view', (_, res) =>{
    res.sendFile(__dirname + '/files/view.html');
})

// Expoose ttf font
app.all('/PressStart2P-Regular.ttf', (_, res) =>{
    res.sendFile(__dirname + '/files/PressStart2P-Regular.ttf')
})


// Ceate User Note
app.post('/api/createNote', (req, res, next) =>{
    hash = crypto.createHash('md5').update(id.toString()).digest('hex')
    try{
        setNote(hash, req.body.title, req.body.content);
    }
    catch(e){
        res.send({message: "error :("});
        next;
    }
    res.send({message: {privateKey: savePairKey(hash), url: `/view?hash=${hash}`}});
    id ++;
})

// Verify Key signature to view note
app.post('/api/viewNote/:hash', (req, res) =>{
    try{
        if(verifyPairKey(req.params.hash, req.body.privateKey)
        || verifyPairKey('highest-privilege', req.body.privateKey)){
            res.send({message: noteDB.get(req.params.hash)})
        }
        else{
            res.send({message: {title: '', content: 'Pemission Denied :('}})
        }
    }
    catch(e){
        res.send({message: {title: '', content: 'Authentication failure'}})
    }
})

// Awake the bot to see
app.get("/api/report/:hash", (req, res) => {
	check(req.params.hash, privilegePrivateKey);
	res.end("Admin bot will view your note");
});

// Start listening
app.listen(port, ()=>{
    console.log(`Service "NSSCTF/TimeTrcer" listening at port ${port}`)
})
