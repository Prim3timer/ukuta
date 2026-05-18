const nodemailer = require("nodemailer");

const sendMail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTestAccount({
      host: "smtp.gmail.com",
      service: "gmail",
      post: 587,
      secure: true,
      auth: {
        user: "majicmethod@gmail.com",
        pass: "qxompjkfobinbydl",
        // pass: "qxom pjkf obin bydl",
      },
    });
    const info = await transporter.sendMail({
      from: "majicmethod@gmail.com",
      to: "amaluekwelie@gmail.com",
      subject,
      message,
      html: "<b>Hello World</b>",
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

const mailSender = async (req, res) => {
  console.log({ reqBody: req.body });
  const { email, subject, message } = req.body;
  try {
    const response = await sendEmai(req.body);
    if (response) {
      res.send(response.data);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  mailSender,
};
