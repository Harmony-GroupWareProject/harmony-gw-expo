// database.js
import * as SQLite from 'expo-sqlite';

let db;

export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('harmony.db');
  }
  return db;
};

export const createTables = async () => {
  const db = await openDatabase();
  await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS orgList (
          orgCd TEXT PRIMARY KEY,
          orgName TEXT,
          upperOrgCd TEXT,
          createDate TEXT,
          updateDate TEXT
        )`,
        [],
        () => {
          console.log('orgList table created');
          resolve();
        },
        (txObj, error) => {
          console.log('Error creating orgList table', error);
          reject(error);
        }
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS empList (
          empNo TEXT PRIMARY KEY,
          empName TEXT,
          email TEXT,
          hireDate TEXT,
          orgCd TEXT,
          outDate TEXT,
          password TEXT,
          phoneNum TEXT,
          position TEXT,
          role TEXT,
          createDate TEXT,
          updateDate TEXT
        )`,
        [],
        () => {
          console.log('empList table created');
          resolve();
        },
        (txObj, error) => {
          console.log('Error creating empList table', error);
          reject(error);
        }
      );
    });
  });
};

export const insertOrgList = async orgList => {
  const db = await openDatabase();
  await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM orgList',
        [],
        () => {
          console.log('orgList table cleared');
          orgList.forEach(org => {
            tx.executeSql(
              `INSERT INTO orgList (orgCd, orgName, upperOrgCd, createDate, updateDate) 
            VALUES (?, ?, ?, ?, ?)`,
              [org.orgCd, org.orgName, org.upperOrgCd, org.createDate, org.updateDate],
              () => console.log('Org inserted'),
              (txObj, error) => {
                console.log('Error inserting org', error);
                reject(error);
              }
            );
          });
          resolve();
        },
        (txObj, error) => {
          console.log('Error clearing orgList table', error);
          reject(error);
        }
      );
    });
  });
};

export const insertEmpList = async empList => {
  const db = await openDatabase();
  await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM empList',
        [],
        () => {
          console.log('empList table cleared');
          empList.forEach(emp => {
            tx.executeSql(
              `INSERT INTO empList (empNo, empName, email, hireDate, orgCd, outDate, password, phoneNum, position, role, createDate, updateDate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                emp.empNo,
                emp.empName,
                emp.email,
                emp.hireDate,
                emp.orgCd,
                emp.outDate,
                emp.password,
                emp.phoneNum,
                emp.position,
                emp.role,
                emp.createDate,
                emp.updateDate,
              ],
              () => console.log('Emp inserted'),
              (txObj, error) => {
                console.log('Error inserting emp', error);
                reject(error);
              }
            );
          });
          resolve();
        },
        (txObj, error) => {
          console.log('Error clearing empList table', error);
          reject(error);
        }
      );
    });
  });
};

export const fetchOrgList = async callback => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM orgList',
        [],
        (txObj, { rows: { _array } }) => {
          callback(_array);
          resolve(_array);
        },
        (txObj, error) => {
          console.log('Error fetching orgList', error);
          reject(error);
        }
      );
    });
  });
};

export const fetchEmpList = async callback => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM empList',
        [],
        (txObj, { rows: { _array } }) => {
          callback(_array);
          resolve(_array);
        },
        (txObj, error) => {
          console.log('Error fetching empList', error);
          reject(error);
        }
      );
    });
  });
};
