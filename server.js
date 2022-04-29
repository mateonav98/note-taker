// GIVEN a note-taking application


// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column


// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes


const express = require('express');
const { fstat } = require('fs');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid.js');
const { json } = require('express/lib/response');
// const landingPage = require('./public/index.html');
// const notesPage = require('./public/notes.html');
const PORT = process.env.port || 3001;
// const api = require('./public/assets/js/index.js');

const app = express ();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET ROUTE for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// GET ROUTE for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

//  Read the `db.json` file and return all saved notes as JSO
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
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            let parsedNotes = JSON.parse(data);
            parsedNotes = parsedNotes.push(newNote)
            fs.writeFile(
                './db/db.json', 
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr 
                        ? console.error(writeErr) 
                        : console.info('Successfully updated notes')
                        );
                    }
                  });
              
                  const response = {
                    status: 'success',
                    body: newNote,
                  };
              
                  console.log(response);
                  res.json(response);
                } else {
                  res.json('Error in posting review');
                }
              });

      
              
// GET ROUTE for all others
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);