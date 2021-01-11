// 银行号
export function bankNumbers(rule, value, callback) {
    if (value == '') {
        return callback(new Error('银行账号不能为空'))
    } else {
        let re = /^[0-9A-Z-]{12,20}$/;
        if (!re.test(value)) {
            return callback(new Error('银行账号输入格式有误'))
        }
        return callback();
    }
}

