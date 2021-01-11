// 手机号
export function elValidatePhone(rule, value, callback) {
    if (value == '') {
        return callback(new Error('手机号码不能为空'))
    } else {
        let re = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (!re.test(value)) {
            return callback(new Error('手机号码输入格式有误'))
        }
        return callback();
    }
}

// 联系方式
export function contactInformation(rule, value, callback) {
    if (value == '') {
        return callback(new Error('联系方式不能为空'))
    } else {
        let isMob= /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8})|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;  
        if(!isMob.test(value)) {
            return callback(new Error('联系方式输入格式有误'))
        }
        return callback();
    }
}

