import rateLimit from 'express-rate-limit';

// limiter untuk tiap request
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // waktu untuk limiter sebelum di refresh
    max: 20, // Jumlah maksimum request dalam jendela waktu
    message: { error: 'Terlalu banyak permintaan dari alamat IP ini, silakan coba lagi nanti.' },
});

export = limiter