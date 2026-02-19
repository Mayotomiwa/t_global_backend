const { AppDataSource } = require('./dist/config/data-source.config');

AppDataSource.initialize()
    .then(async (ds) => {
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