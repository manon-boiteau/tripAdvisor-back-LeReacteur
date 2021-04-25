const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

/* MAILGUN CONFIGURATION */
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.post("/form", (req, res) => {
  try {
    const { firstname, lastname, email, subject, message } = req.fields;
    if (req.fields) {
      if (firstname && lastname && email && subject && message) {
        const data = {
          from: `${firstname} ${lastname} <${email}> `,
          to: "manonboiteau@orange.fr",
          subject: subject,
          text: message,
        };

        mailgun.messages().send(data, (error, body) => {
          if (!error) {
            return res.status(200).json(body);
          } else {
            res.status(401).json({ message: error.message });
          }
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This endpoint does not exist." });
});

app.listen(process.env.PORT, () => {
  console.log("Go go goo server 🐣");
});
