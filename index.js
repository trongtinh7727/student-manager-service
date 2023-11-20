const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp({ // Firebase admin credentials
    credential: admin.credential.cert("./credential.json")  });

const app = express();
app.use(bodyParser.json());

// Endpoint to get all users
app.get('/getAllUsers', (req, res) => {
    admin.auth().listUsers()
        .then((listUsersResult) => {
            const users = listUsersResult.users.map((userRecord) => userRecord.toJSON());
            res.status(200).json(users);
        })
        .catch(error => {
            // Handle errors, e.g., if listing users fails
            res.status(500).send('Error getting users');
        });
});

app.post('/deleteUser', (req, res) => {
    const uid = req.body.uid;

    admin.auth().deleteUser(uid)
        .then(() => res.status(200).send('User deleted successfully'))
        .catch(error => res.status(500).send('Error deleting user'));
});

app.listen(3000, () => console.log('Server is running'));