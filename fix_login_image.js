const fs = require('fs');
const path = require('path');

const dir = './';
const files = ['login.html', 'register.html'];

const newImageHTML = `
            <!-- Top Logo Image -->
            <img src="ERP_logo.png" alt="App Logo" style="width: 100%; max-width: 220px; height: auto; margin: 0 auto 20px auto; display: block; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">
`;

let count = 0;

for (const file of files) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    const regex = /<!-- Animated Lottie Illustration -->[\s\S]*?<\/lottie-player>/;
    
    if (regex.test(content)) {
        content = content.replace(regex, newImageHTML);
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        count++;
    }
}

console.log('Updated ' + count + ' HTML files to replace broken Lottie with ERP logo image.');
