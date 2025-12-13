const bcrypt = require('bcryptjs'); // or bcrypt, need to check package.json

async function check() {
    const hash = '$2b$10$k6h/Lhjy7ZX5brXdmxGhg.sdqt1l/FU3fpCNVTT0h1RRNPgVqtcPe';
    const pass = 'password123';
    // try bcryptjs first as it's common in Next.js
    try {
        const match = await bcrypt.compare(pass, hash);
        console.log("Match:", match);
    } catch (e) {
        console.log("Error:", e.message);
    }
}
check();
