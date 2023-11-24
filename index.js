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

app.post('/updateUser', (req, res) => {
    const uid = req.body.uid;
    const newEmail = req.body.newEmail; // New email
    const newPassword = req.body.newPassword; // New password

    // Prepare an update object
    let update = {};

    // Add email to update object if it's not empty
    if (newEmail && newEmail.trim() !== '') {
        update.email = newEmail;
    }

    // Add password to update object if it's not empty
    if (newPassword && newPassword.trim() !== '') {
        update.password = newPassword;
    }

    // Check if there is anything to update
    if (Object.keys(update).length === 0) {
        return res.status(400).send('No valid fields provided for update.');
    }

    admin.auth().updateUser(uid, update)
        .then(() => res.status(200).send('User updated successfully'))
        .catch(error => res.status(500).send('Error updating user: ' + error.message));
});



app.listen(3000, () => console.log('Server is running'));
