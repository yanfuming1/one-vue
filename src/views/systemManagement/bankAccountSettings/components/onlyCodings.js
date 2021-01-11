// 行号
export function onlyCodings(rule, value, callback) {
    if (value == '') {
        // return callback(new Error('银行账号不能为空'))
    } else {
        let re = /^[0-9]{12}$/;
        if (!re.test(value)) {
            return callback(new Error('行号输入格式有误'))
        }
        return callback();
    }
}