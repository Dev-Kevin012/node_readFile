const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  if (url === "/") {
    fs.readFile("message.txt", (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Internal Server Error");
        return;
      }
      let message = data.toString();

      res.write("<html>");
      res.write("<head><title>Enter Message</title></head>");
      res.write("<body>");
      res.write(`<p>${message}</p>`);
      res.write("<form method='POST' action='/submit'>");
      res.write("<input type='text' name='message'>");
      res.write("<button type='submit'>Submit</button>");
      res.write("</form>");
      res.write("</body>");
      res.write("</html>");
      res.end();
    });
  } else if (url === "/submit" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedbody = Buffer.concat(body).toString();
      const message = parsedbody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err) console.log(err);
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  }
};

module.exports = requestHandler;
