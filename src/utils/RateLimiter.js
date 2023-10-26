const rateLimit = require('express-rate-limit')

// limiter untuk tiap request
const limiter = rateLimit({
    windowMs: 10 * 1000, // waktu untuk limiter sebelum di refresh
    max: 3, // Jumlah maksimum request dalam jendela waktu
    message: { error: 'Terlalu banyak permintaan, silakan coba lagi nanti.' },
});

module.exports = limiter