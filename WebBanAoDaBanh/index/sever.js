const sql = require('mssql');

const dbConfig = {
    user: 'huynh',
    password: 'quochuynh622105',
    server: 'LAPTOP-2771E9IH\\SQLEXPRESS',
    database: 'PttkhtttDB',
    options: {
        enableArithAbort: true,
        encrypt: false,
        trustServerCertificate: true,
    },
};

sql.connect(dbConfig)
    .then(() => {
        console.log('Kết nối SQL Server thành công!');
        return sql.query('SELECT 1 AS test');
    })
    .then(result => {
        console.log('Kết quả:', result.recordset);
    })
    .catch(err => {
        console.error('Lỗi kết nối SQL Server:', err);
    });