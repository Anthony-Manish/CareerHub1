const http = require('http');
const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');
const { MongoClient, ObjectId } = require('mongodb');
const querystring = require('querystring');
const bcrypt = require('bcrypt');

const hostname = '127.0.0.1';
const port = 4000;
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'careerhub';

let client = null;

const connectDB = async () => {
    if (!client) {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log("Connected to MongoDB");
    }
    return client.db(dbName);
};

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const apiProcess = fork(path.join(__dirname, 'api.js'));
apiProcess.on('message', (message) => console.log(`Message from API process: ${message}`));
apiProcess.on('exit', (code) => console.log(`API process exited with code ${code}`));

const getFileContent = (filePath, res) => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end("<h1>404 Not Found</h1>");
        } else {
            res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'text/plain' });
            res.end(content);
        }
    });
};

const handleDatabaseOperation = async (formData, actionType, res, collectionName) => {
    try {
        const db = await connectDB();
        const collection = db.collection(collectionName);

        if (actionType === 'register') {
            const existingUser = await collection.findOne({ email: formData.email });
            if (existingUser) return res.end(JSON.stringify({ success: false, message: 'User already exists.' }));

            formData.password = await bcrypt.hash(formData.password, 10);
            delete formData.confirm_password;
            await collection.insertOne(formData);
            res.end(JSON.stringify({ success: true, message: 'Registration successful!' }));
        } else if (actionType === 'login') {
            const user = await collection.findOne({ email: formData.email });
            if (user && await bcrypt.compare(formData.password, user.password)) {
                const usernameInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                const userType = collectionName === 'students' ? 'student' : collectionName === 'institutes' ? 'institute' : 'admin';

                res.end(JSON.stringify({
                    success: true,
                    message: 'Login successful!',
                    usernameInitial,
                    userType
                }));
            } else {
                res.end(JSON.stringify({ success: false, message: 'Invalid credentials.' }));
            }
        }
    } catch (error) {
        console.error('Database operation error:', error);
        res.end(JSON.stringify({ success: false, message: 'Database operation failed.' }));
    }
};

const handleInternshipOperations = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('internships');

        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(await collection.find({}).toArray()));
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => body += chunk.toString());
            req.on('end', async () => {
                const data = JSON.parse(body);
                await collection.insertOne(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Internship added successfully!' }));
            });
        } else if (req.method === 'DELETE') {
            const internshipId = req.url.split('/').pop();

            // Validate ObjectId before using it
            if (!ObjectId.isValid(internshipId)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Invalid internship ID.' }));
            }

            const result = await collection.deleteOne({ _id: new ObjectId(internshipId) });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: result.deletedCount === 1, message: result.deletedCount === 1 ? 'Internship deleted successfully!' : 'Internship not found.' }));
        }
    } catch (error) {
        console.error('Internship operation error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Internal server error.' }));
    }
};

const handleFormSubmission = (req, res) => {
    let body = '';
    req.on('data', (chunk) => body += chunk.toString());
    req.on('end', () => {
        const parsedData = querystring.parse(body);
        if (['/student', '/institute', '/admin'].includes(req.url)) {
            handleDatabaseOperation(parsedData, parsedData.action, res, req.url.slice(1) + 's');
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Invalid endpoint.' }));
        }
    });
};

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/internships')) {
        return handleInternshipOperations(req, res);
    } else if (req.method === 'POST') {
        res.setHeader('Content-Type', 'application/json');
        return handleFormSubmission(req, res);
    } else {
        const filePath = path.join(__dirname, req.url === '/' ? 'index1.html' : req.url);
        return getFileContent(filePath, res);
    }
});

server.listen(port, hostname, async () => {
    await connectDB();
    console.log(`Server running at http://${hostname}:${port}/`);
});
