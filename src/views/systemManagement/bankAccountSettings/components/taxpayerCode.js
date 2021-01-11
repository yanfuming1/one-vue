// 行号
export function taxpayerCode(rule, value, callback) {
    if (value == '') {
        // return callback(new Error('银行账号不能为空'))
    } else {
        let re = /^\w+$/;
        if (!re.test(value)) {
            return callback(new Error('输入格式有误'))
        }
        return callback();
    }
}