const sqlite3 = require('sqlite3').verbose();

class Database {
  load(path) {
    return new Promise((resolve, reject) => { 
      this.db = new sqlite3.Database(path, error => {
        if (error) reject(error);
        resolve();
      });
    }).catch(error => {
      throw error;
    });
  }

  run(sql, params) { // sql: string, params: [string]
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (error) {
        if (error) reject(error);
        resolve([this.changes, this.lastID]);
      });
    }).catch(error => {
      throw error;
    });
  }

  get(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    }).catch(error => {
      throw error;
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((error) => {
        if (error) reject(error);
        resolve();
      });
    }).catch(error => {
      throw error;
    });
  }
}

module.exports = Database;