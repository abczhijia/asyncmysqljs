/**
 * Created by db on 2017/10/23.
 */
const mysql = require('mysql')

const defautConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    connectionLimit: 20
}

const AsyncMysqljs = function(config=defautConfig){
    const pool = mysql.createPool(config)
    const q = function (sql, values) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) return reject(err)
                conn.query(sql, values, (err, rows) => {
                    if (err) reject(err)
                    else resolve(rows)
                    conn.release()
                })
            })
        })
    }
    
    /*
    从数据库中查询一条数据，返回值是对象，而非数组
    最好在sql语句中加一个唯一的限制条件
    */
    const get = (sql, values) => {
        try {
            return q(sql, values).then(rows => {
                if (rows.length >= 1) {
                    return rows[0]
                }
            })
        } catch (err) {
            return new Promise((resolve, reject) => {
                reject(err)
            })
        }
    }

    return {query: q, delete: q, update: q, insert: q, execute: q, get}
}

module.exports = AsyncMysqljs
