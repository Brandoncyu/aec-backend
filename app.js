const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

var userEmail;

// view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ ectended: false }));
app.use(bodyParser.json());

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('contact');
    // res.render('index');
});

// app.post('/send', (req, res) => {
app.post('/send', (req, res) => {
    let sendEmail = req.body.email
    let sendBody = req.body.text
    
    // userEmail = "brandoncyu@gmail.com";
    // NotesAsString = req.body.message;
    var NotesAsString = "TimeStamp = Tuesday@10:42pm \n Latitude: 123123424 \n Longitude: 23423424 \n Blob: Voice Recording"; // dummy data

    const output = `
        <h3>Stroll Notes</h3>
        <p>${NotesAsString}</p>
    `;

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "StrollAppEmail@gmail.com", // generated ethereal user
            pass: "Shot51222!" // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Stroll" <StrollAppEmail@gmail.com>', // sender address
        // to: "jchernick2010@gmail.com",
        to: sendEmail, // list of receivers .. Send to userEmail
        subject: "You took a stroll today!", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    // let info = await transporter.sendMail(mailOptions)
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.log(error);
        }

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
    });
});

app.listen(4000, () => console.log("server started..."))
