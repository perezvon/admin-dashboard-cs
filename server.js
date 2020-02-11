"use strict";

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const helpers = require("./globalHelpers.js");

const app = express();

const port = process.env.PORT || 3001;

//support parsing of application/json type post data
app.use(bodyParser.json({ limit: "5mb" }));

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

app.use(express.static(path.resolve(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.get("/api", (req, res) => res.send("API active"));

app.post("/api", (req, res) => {
  const orderData = req.body[0] ? req.body[0] : req.body;
  console.log(orderData);
  helpers.checkForSupervisor(orderData.user_id, company_id => {
    helpers.approvalNeeded(company_id, orderData);
  });
  res.end("yes");
});

app.get("/api/users/:company", (req, res) => {
  const url = process.env.API_URL;
  const base64key = Buffer.from(
    process.env.REACT_APP_API_USER + ":" + process.env.REACT_APP_API_KEY,
    "utf8"
  ).toString("base64");
  var options = {
    method: "GET",
    hostname: url,
    port: null,
    path:
      "/api/users?company_id=" + req.params.company + "&items_per_page=9999",
    headers: {
      "cache-control": "no-cache",
      Authorization: "Basic " + base64key
    }
  };
  helpers.getAPIData(options, data => {
    res.send(data);
    res.end();
  });
});

app.get("/api/orders/:company/", (req, res) => {
  const url = process.env.API_URL;
  const base64key = Buffer.from(
    process.env.REACT_APP_API_USER + ":" + process.env.REACT_APP_API_KEY,
    "utf8"
  ).toString("base64");
  var options = {
    method: "GET",
    hostname: url,
    path:
      "/api/orders?company_id=" + req.params.company + "&items_per_page=9999",
    headers: {
      "cache-control": "no-cache",
      Authorization: "Basic " + base64key
    }
  };
  helpers.getAPIData(options, data => {
    res.send(data);
    res.end();
  });
});

app.get("/api/orders/:company/:id", (req, res) => {
  const url = process.env.API_URL;
  const base64key = Buffer.from(
    process.env.REACT_APP_API_USER + ":" + process.env.REACT_APP_API_KEY,
    "utf8"
  ).toString("base64");
  var options = {
    method: "GET",
    hostname: url,
    path: "/api/orders/" + req.params.id + "?items_per_page=9999",
    headers: {
      "cache-control": "no-cache",
      Authorization: "Basic " + base64key
    }
  };
  helpers.getAPIData(options, data => {
    res.send(data);
    res.end();
  });
});

app.post("/api/approve-deny", (req, res) => {
  const data = req.body;
  data.forEach(o => {
    helpers.updateOrderStatus(o.order_id, o.status);
  });
  res.send({ status: "Order Statuses Updated" });
  res.end();
});

app.get("/api/approve", (req, res) => {
  const approved = req.query.result;
  const orderID = req.query.OrderID;
  if (approved === "true") {
    helpers.updateOrderStatus(orderID, "P");
    res.send("request approved!");
  } else {
    //helpers.updateOrderStatus(orderID, 9)
    res.sendFile(path.join(__dirname + "/deny.html"));
    //helpers.sendEmail(address, 'denied')
  }
});

app.post("/api/approve", (req, res) => {
  const comment = req.body.comment;
  const address = req.body.email;
  const OrderID = req.body.orderID;
  const orderNumber = req.body.orderNumber;
  helpers.getOrderInfo(OrderID, order => {
    order.comment = comment;
    const options = {
      from: process.env.MAIL_SEND_ADDRESS,
      to: address, // list of receivers
      subject: "Order Denied - Order #" + orderNumber
    };
    helpers.updateOrderStatus(OrderID, "D");
    helpers.sendEmail(address, options, order, "denied");
    res.send("request denied.");
  });
});

app.listen(port, function() {
  console.log("App listening on port " + port);
});
