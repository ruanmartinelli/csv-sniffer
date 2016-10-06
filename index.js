const _         = require('lodash');
const fs        = require('fs');
const uuid      = require('node-uuid');
const chalk     = require('chalk');
const config    = require('./config.json');

const info      = chalk.bold.blue;
const error     = chalk.bold.red;
const success   = chalk.bold.green;
const baseDir   = __dirname + '/attachments/'

const MailListener = require("mail-listener2");

const listener = new MailListener({
    username:config.email,
    password:config.password,
    host: config.host,
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    markSeen: true
});

listener.on("server:connected",     ()    => console.log(success("Connected")));
listener.on("server:disconnected",  ()    => console.log(error("Disconnected")));
listener.on("error",                (err) => console.log(err));

// Handles new messages
listener.on("mail", (mail, seqno, attributes) => {
    console.log(info("You have 1 new message"));
    console.log("FROM   : " + _.map(mail.from, (addr) => console.log("\n" + addr)));
    console.log("TO     : " + _.map(mail.to, (addr) => console.log("\n" + addr)));
    console.log("SUBJECT: " + mail.subject);
    console.log("DATE   : " + mail.date);
    console.log("RECDATE: " + mail.receiveDate);
    console.log(info("Checking attachments..."));

    if(mail.attachments && mail.attachments.length > 0){
        const csvAttachments = mail.attachments.filter(isCSV);

        console.log(mail.attachments.length + " attachments found");
        console.log(csvAttachments.length + " of those are .csv files");
        console.log(info("Saving attachments..."));

        _.forEach(csvAttachments, saveFromAttachment);
    }else{
        console.log(info("No attachment found :("));
    }

});

listener.start();


function isCSV(attachment){
    return attachment.contentType && attachment.contentType === 'text/csv';
}

function saveFromAttachment(attachment){
    let filename = baseDir + _.toString(new Date()) + " " + uuid.v1() + " - " + attachment.fileName;
    let wstream = fs.createWriteStream(filename);

    wstream.on('error',  (err) => console.log (error(err)));
    wstream.on('finish', () => console.log    (success("File " + filename + " saved successfuly")));

    wstream.write(attachment.content);
    wstream.end();
}
