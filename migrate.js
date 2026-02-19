const fs = require('fs');
const { AppDataSource } = require('./dist/config/data-source.config');

console.log('DEBUG: migrate.js starting...');
const envPath = '.env';
if (fs.existsSync(envPath)) {
    console.log('DEBUG: .env file found at root!');
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('DEBUG: .env content length:', content.length);
} else {
    console.log('DEBUG: No .env file found at root.');
}

const dbUrl = process.env.DATABASE_URL;
console.log('DEBUG: process.env.DATABASE_URL exists:', !!dbUrl);
if (dbUrl) {
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
    console.log('DEBUG: DATABASE_URL:', maskedUrl);
} else {
    console.log('DEBUG: DATABASE_URL is not set!');
}

AppDataSource.initialize()
    .then(async (ds) => {
        const dbUrl = process.env.DATABASE_URL;
        console.log('DEBUG: DATABASE_URL exists:', !!dbUrl);
        if (dbUrl) {
            // Mask password for security
            const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
            console.log('DEBUG: DATABASE_URL:', maskedUrl);
        } else {
            console.log('DEBUG: DATABASE_URL is not set!');
        }
        console.log('Running migrations...');
        await ds.runMigrations();
        console.log('Migrations complete.');
        await ds.destroy();
        process.exit(0);
    })
    .catch((err) => {
        console.error('Migration failed:', err);
        process.exit(1);
    });