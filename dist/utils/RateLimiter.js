"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// limiter untuk tiap request
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // waktu untuk limiter sebelum di refresh
    max: 20, // Jumlah maksimum request dalam jendela waktu
    message: { error: 'Terlalu banyak permintaan dari alamat IP ini, silakan coba lagi nanti.' },
});
module.exports = limiter;
//# sourceMappingURL=RateLimiter.js.map