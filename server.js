const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid.js');

const PORT = process.env.PORT || 3001;

const app = express ();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// GET ROUTE for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// GET ROUTE for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

//  GET ROUTE TO stored noted, read the `db.json` file and return all saved notes as JSO
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
}); 

// POST /api/notes
app.post('/api/notes', (req, res) => {
    // Log our request to the terminal
    console.info(`${req.method} request received to add new note`)
    const { title, text } = req.body;
    if (title && text) {
        // Object to be saved in our json file
      const newNote = {
        title,
        text,
        //unique id
        id: uuid(),
      };
    //   Reading data from our json file
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            // combining data written in the new note with data stored in db.json ile
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote)
            // witing nre data to the json file
            fs.writeFile(
                './db/db.json', 
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr 
                        ? console.error(writeErr) 
                        : console.info('New note has been created')
                        );
                    }
                  });
                //   will let user know note has been written
                  const response = {
                    status: 'Completed',
                    body: newNote,
                  };
              
                  console.log(response);
                  res.json(response);
                } else {
                  res.json('Failed to create new note');
                }
              });

      
              
// GET ROUTE for all others pathways
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);