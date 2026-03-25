
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testUpload() {
    try {
        // Login first
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'admin',
            password: 'Password123!' // Pamatuji si z predchozi konverzace
        });
        
        const cookie = loginRes.headers['set-cookie'][0];
        console.log('Login OK');
        
        // Vytvořme fake obrázek
        fs.writeFileSync('fake.png', 'fake image content');

        const fd = new FormData();
        fd.append('title', 'Test Event');
        fd.append('image', fs.createReadStream(path.join(__dirname, 'fake.png')));

        const res = await axios.post('http://localhost:5000/api/events', fd, {
            headers: {
                ...fd.getHeaders(),
                Cookie: cookie
            }
        });
        
        console.log('Upload OK:', res.data);
    } catch (err) {
        console.log('Upload failed:', err.response?.data || err.message);
    } finally {
        if(fs.existsSync('fake.png')) fs.unlinkSync('fake.png');
    }
}
testUpload();

