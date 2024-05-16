const fs = require('fs');

db = db.getSiblingDB('yummy-yams');

const pastriesData = JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/pastries.json', 'utf8'));

db.pastries.insertMany(pastriesData);