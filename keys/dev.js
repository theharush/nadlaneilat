//prod.js - production keys!
module.exports = {
    mongoURI: process.env.MONGO_URL || "mongodb://localhost:27017/nadlaneilat",
    cookieSecret: process.env.COOKIE_SECRET || "mynameischikichikislimshady",
};
