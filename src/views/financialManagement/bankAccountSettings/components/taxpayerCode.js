// 行号
export function taxpayerCode(rule, value, callback) {
    if (!value) {
        return callback(new Error('纳税人识别号不能为空'))
    } else {
        let re = /^\w+$/;
        if (!re.test(value)) {
            return callback(new Error('输入格式有误'))
        }
        return callback();
    }
}