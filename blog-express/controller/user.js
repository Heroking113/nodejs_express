const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
    //防止sql注入  
    username=escape(username)

    //生成加密密码
    password = genPassword(password)
    password=escape(password)
    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    return exec(sql).then(rows=>{
        return rows || {}
    })
}

module.exports=login