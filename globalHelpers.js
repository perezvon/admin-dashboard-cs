
function sendEmail(address, options, data, template) {
  const EmailTemplate = require('email-templates').EmailTemplate
  const path = require('path')

  const templateDir = path.join(__dirname, 'templates', template)

  const htmlTemplate = new EmailTemplate(templateDir);

  const nodemailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'mailgun',
 auth: {
     user: process.env.MAIL_USER,
     pass: process.env.MAIL_PASS
 }
  });

  htmlTemplate.render(data, function (err, result) {
    let mailOptions = options
    mailOptions.text = result.text
    mailOptions.html = result.html

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    });

  })
}

function getOrderInfo(orderID, callback) {
  const http = require("http");
  const base64key = Buffer.from(process.env.REACT_APP_API_USER + ':' + process.env.REACT_APP_API_KEY, 'utf8').toString('base64')
  console.log(base64key)
  const options = {
    "method": "GET",
    "hostname": process.env.API_URL,
    "port": null,
    "path": "/api/orders/" + orderID,
    "headers": {
      "cache-control": "no-cache",
      Authorization: 'Basic ' + base64key
    }
  };

  const req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        if (body && !!body.toString()) {
        const order = JSON.parse(body.toString())[0];
        return callback(order);
        }
      });
    });
  req.end();
}

//currently deprecated, sending with env var QM_EMAIL instead. We'd use this if there were more than one supervisor/QM for a group.
function checkForSupervisor(customerID, callback) {
  const http = require("http");
  const base64key = Buffer.from(process.env.REACT_APP_API_USER + ':' + process.env.REACT_APP_API_KEY, 'utf8').toString('base64')
  const options = {
    "method": "GET",
    "hostname": process.env.API_URL,
    "port": null,
    "path": "/api/customers/" + customerID,
    "headers": {
      "cache-control": "no-cache",
      Authorization: 'Basic ' + base64key
    }
  };

  const req = http.request(options, function (res) {
  let chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
      var body = Buffer.concat(chunks);
      if (body && !!body.toString()) {
        const user = JSON.parse(body.toString())[0];
        return callback(user.AdditionalField1);
      }
  });
});

req.end();
}

function approvalNeeded(address, orderInfo) {
  //update order status to Awaiting Approval / On Hold
  updateOrderStatus(orderInfo.OrderID, 6);
  //send approval email
  const options = {
    from: process.env.MAIL_SEND_ADDRESS,
    to: address, // list of receivers
    subject: 'Approval Needed - Order #' + orderInfo.InvoiceNumberPrefix + orderInfo.InvoiceNumber
  }
	if (address) sendEmail(address, options, orderInfo, 'approval')
  else return false;
}

function updateOrderStatus(order_id, status, callback) {
  console.log(status)
  const http = require("http");
  const request = require("request")
  const base64key = Buffer.from(process.env.REACT_APP_API_USER + ':' + process.env.REACT_APP_API_KEY, 'utf8').toString('base64')
  const url = "http://" + process.env.API_URL + "/api/orders/" + order_id
  const options = {
    "method": "PUT",
    "url": url,
    "headers": {
      "cache-control": "no-cache",
      Authorization: 'Basic ' + base64key,
      "Content-Type": "application/json"
    },
    body: { status: status, notify_user: "1", notify_department: "1" },
  json: true
  };

  request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
}

function getAPIData (options, callback) {

  const http = require("http");

  const req = http.request(options, function (res) {
    let chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      let body = Buffer.concat(chunks);
      return callback(body.toString());
    });
  });

  req.end();
}

module.exports = {checkForSupervisor, approvalNeeded, updateOrderStatus, sendEmail, getOrderInfo, getAPIData};
