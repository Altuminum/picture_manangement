import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite');

// Open the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database successfully\n');
});

// Get all tables
db.all(`SELECT name FROM sqlite_master WHERE type='table'`, [], (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err);
    return;
  }

  // For each table, get its contents
  tables.forEach(table => {
    console.log(`\n=== Table: ${table.name} ===`);
    
    // Get table schema
    db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
      if (err) {
        console.error(`Error getting schema for table ${table.name}:`, err);
        return;
      }
      
      console.log('\nColumns:');
      columns.forEach(col => {
        console.log(`  ${col.name} (${col.type})`);
      });

      // Get table contents
      db.all(`SELECT * FROM ${table.name}`, [], (err, rows) => {
        if (err) {
          console.error(`Error getting data from table ${table.name}:`, err);
          return;
        }
        
        console.log('\nRows:');
        rows.forEach(row => {
          console.log(row);
        });

        // Close the database after the last table
        if (table.name === tables[tables.length - 1].name) {
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
              return;
            }
            console.log('\nDatabase connection closed.');
          });
        }
      });
    });
  });
});
