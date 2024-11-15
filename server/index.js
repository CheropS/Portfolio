const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '/')));

// Set up OAuth2
const oauth2Client = new google.auth.OAuth2(
    '53391524282-uui1k9dd4547ftmnngc1e01f4qjb0a3q.apps.googleusercontent.com',
    'YGOCSPX--AFyN4gl8W4kXMZKx6Qm_BjAC3K2',
    'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: 'YOUR_REFRESH_TOKEN'
});

app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'sharrycherop@gmail.com',
                clientId: '53391524282-uui1k9dd4547ftmnngc1e01f4qjb0a3q.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: 'YOUR_REFRESH_TOKEN',
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: 'youremail@gmail.com',
            to: 'recipient@example.com',
            subject: subject,
            html: `<p>You have a new contact request</p>
                   <h3>Contact Details</h3>
                   <ul>
                       <li>Name: ${name}</li>
                       <li>Email: ${email}</li>
                   </ul>
                   <h3>Message</h3>
                   <p>${message}</p>`
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', result);
        res.send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending message');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
