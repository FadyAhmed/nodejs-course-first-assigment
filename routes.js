const fs = require('fs');

var user = '';
const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>hello</title></head>');
        res.write('<body><form  action="/users" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form> </body>');
        res.write('<html>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/users' && method == 'POST') {

        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedData = Buffer.concat(body).toString();
            user = parsedData.split('=')[1];
            console.log(user);
            
            fs.writeFile('users.txt', user, () => {
                res.statusCode = 308;
                res.setHeader('Location', '/user');
                return res.end();
            });
        });
    }

    if (url === '/user') {
        console.log(user);
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>hello</title></head>');
        res.write(`<h1>${user}</h1>`);
        res.write('</html>');
        return res.end();
    }
}

module.exports = requestHandler;