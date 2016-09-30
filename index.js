const fs       = require('fs');
const config   = require('./config.json');
const MailListener = require("mail-listener2");


var listener = new MailListener({
  username: config.email,
  password: config.password,
  host: config.host,
  port: 993,
  tls: true,
  connTimeout: 10000,
  authTimeout: 5000,
  // debug: console.log,
  tlsOptions: { rejectUnauthorized: false },
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  //fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  // mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
});

listener.start(); // start listening

listener.on("server:connected", () => console.log("imapConnected"));

listener.on("server:disconnected", () => console.log("imapDisconnected"));

listener.on("error", (err) => console.log(err));

listener.on("mail", (mail, seqno, attributes) => {
  // do something with mail object including attachments
  console.log(mail.attachments.length + " attachments");
  console.log(mail.from.length + " from");
  console.log(mail.date);
});

listener.on("attachment", function(attachment){
  // console.log(attachment);
});
