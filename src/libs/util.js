import cookies from './util.cookies'
// store
import store from '@/store/index'
import db from './util.db'
import log from './util.log'
import { MessageBox } from 'element-ui'
import { staffQueryById, queryDepartmentByUserId, GetPositionDic, staffStaffDictionary} from '../api/system/staff/staff'
import { GetLimitsTree, GetRoleTree } from '../api/system/role/role'
import { GetDepart, getCompanyDepDic} from '../api/system/depart/depart'

const util = {
  cookies,
  db,
  log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || '企企通'
  // window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
  window.document.title = `${processTitle}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

/**
 * 将任意对象转化为树
 * @param data
 * @param key
 * @param pid
 * @param parent
 * @returns {Array}
 */
util.formatDataToTree = function(data, key = 'menu_id', pid = 'parent_id', parent = {}) {
  let map = {}
  const isSetParent = Object.keys(parent).length > 0

  data.forEach(value => {
    if (isSetParent && parent.value.includes(value[parent.key])) {
      value[pid] = 0
    }

    map[value[key]] = { ...value }
  })

  let tree = []
  for (let id in data) {
    if (!data.hasOwnProperty(id)) {
      continue
    }

    // 对应索引
    const index = data[id][key]
    if (!map.hasOwnProperty(index)) {
      continue
    }

    // 子节点压入
    if (map[index][pid]) {
      if (!map[map[index][pid]]) {
        continue
      }

      if (!map[map[index][pid]].hasOwnProperty('children')) {
        map[map[index][pid]]['children'] = []
      }

      if (map[map[index][pid]]['isShow']) {
        map[index]['isShow'] = true
      }
      
      if (!map[map[index][pid]]['isShow']) {
        map[index]['isShow'] = false
      }

      map[map[index][pid]]['children'].push(map[index])
      map[map[index][pid]]['children'] = map[map[index][pid]]['children'].sort((a, b)=>{
        return Number (a.sort) - Number (b.sort)
      })
      continue
    }

    tree.push(map[index])
  }

  return tree
}


/**
 * @description 生成随机数
 * @param {}
 */
function S4() {
  // 生成1-10000之间的随机数
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
}

util.guid = function () {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/**
 * @description 通过人员id获取人员的所有信息
 * @param {id}
 */
util.getUserById = function (id) {
    let info = {}
    staffQueryById(
        {id: id}
    ).then(res => {
        info = res
    })
   return info
}

/**
 * @description 通过人员id获取所在的部门
 * @param {id}
 */
util.getDepartByUserId = function (id) {
  let temp = []
  queryDepartmentByUserId(
      {userId : id}
  ).then(res => {
      temp = res
  })
  return temp
}

/**
 * 秒转时分秒
 * @param value
 */
util.formatSeconds = function (value) {
   let theTime = parseInt(value, 10);// 秒
   let theTime1 = 0;// 分
   let theTime2 = 0;// 小时
   if (theTime > 60) {
       theTime1 = parseInt((theTime / 60).toString(), 10);
       theTime = theTime % 60;
       if (theTime1 > 60) {
           theTime2 = theTime1 / 60;
           theTime1 = theTime1 % 60;
       }
   }
   let result = "" + theTime + "秒";
   if (theTime1 > 0) {
       result = "" + theTime1 + "分" + result;
   }
   if (theTime2 > 0) {
       result = "" + theTime2 + "小时" + result;
   }
   return result;
}

/**
 * 切割数据返回数组
 * @param data
 */
util.splitData = function (data, type) {
    let tem = []
    let result = data.split(type)
    if(result.length > 0){
        result.forEach(item => {
            if(item !== ''){
                tem.push(item)
            }
        })
    }else{
        return result
    }
    return tem
}
/**
 * 数组拼接
 * @param data
 */
util.jointData = function (arr, type) {
    let temSec = ''
    if (Array.isArray(arr)) {
      arr.forEach(item => {
          temSec += item + type
      })
      temSec = temSec.substring(0, temSec.length - 1);
    }
    return temSec
}

/**
 *  多选的时候从根据数组获取里面的值
 *  value 数组 选择的id数组 
 *  dataList 下来数据的数组
 *  type 获取的属性值
 * 
 */
util.getResultByArr = function(value, dataList, type) {
  let result = ''
  if (Array.isArray(value)) {
    value.forEach(item => {
        let temp = dataList.find(el => el.id === item)
        switch (type) {
            case 'name':
                if(temp) { result += temp.name + ',' }
                break
            case 'possessor':
                if(temp) { result += temp.possessor + ',' }
                break
        }
    })
  }
  result = result.substring(0, result.length - 1)
  return result
},

/**
* 判断是否是数组
*/
util.isArray = function (o){
    return Object.prototype.toString.call(o)== '[object Array]';
}
/**
* 判断是否是字符串
*/
util.isString = function (str){ 
    return (typeof str=='string')&&str.constructor==String; 
} 


/**
 * 时间格式化
 * @param time 时间
 * @param fmt 时间格式
 */
function TimeFormat (time, fmt) {
  //author: meizz
  var o = {
      "M+": time.getMonth() + 1, //月份
      "d+": time.getDate(), //日
      "h+": time.getHours(), //小时
      "m+": time.getMinutes(), //分
      "s+": time.getSeconds(), //秒
      "q+": Math.floor((time.getMonth() + 3) / 3), //季度
      S: time.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
          RegExp.$1,
          (time.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
  }
  for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                  ? o[k]
                  : ("00" + o[k]).substr(("" + o[k]).length)
          );
      }
  }
  return fmt;
}

/**
* 获取结束时间
* @param startTime
* @param dayNum
*/
util.getEndTime = function(startTime, dayNum){
  let dateTime = dayNum * 86400000
  if (startTime) {
    let sumTime = new Date(startTime).getTime() + dateTime
    return new Date(sumTime).format('yyyy-MM-dd')
  }
}
/**
 * 获取两个日期相差的年月天
 * @param sDate1
 * @param sDate2
 */

util.timeDifc = function(sDate1,sDate2){
  var fixDate = function(sDate){
      var aD = sDate.split('-');
      for(var i = 0; i < aD.length; i++){
          aD[i] = fixZero(parseInt(aD[i]));
      }
      return aD.join('-');
  };
  var fixZero = function(n){
      return n < 10 ? '0'+n : n;
  };
  var fixInt = function(a){
      for(var i = 0; i < a.length; i++){
          a[i] = parseInt(a[i]);
      }
      return a;
  };
  var getMonthDays = function(y,m){
      var aMonthDays = [0,31,28,31,30,31,30,31,31,30,31,30,31];
      if((y%400 == 0) || (y%4==0 && y%100!=0)){
          aMonthDays[2] = 29;
      }
      return aMonthDays[m];
  };
  var checkDate = function(sDate){
  };
  var y = 0;
  var m = 0;
  var d = 0;
  var sTmp;
  var aTmp;
  sDate1 = fixDate(sDate1);
  sDate2 = fixDate(sDate2);
  if(sDate1 > sDate2){
      sTmp = sDate2;
      sDate2 = sDate1;
      sDate1 = sTmp;
  }
  var aDate1 = sDate1.split('-');
      aDate1 = fixInt(aDate1);
  var aDate2 = sDate2.split('-');
      aDate2 = fixInt(aDate2);
  //计算相差的年份
  y = aDate2[0] - aDate1[0];
  if( sDate2.replace(aDate2[0],'') < sDate1.replace(aDate1[0],'')){
      y = y - 1;
  }
  //计算月份
  aTmp = [aDate1[0]+y,aDate1[1],fixZero(aDate1[2])];
  while(true){
      if(aTmp[1] == 12){
          aTmp[0]++;
          aTmp[1] = 1;
      }else{
          aTmp[1]++;
      }
      if(([aTmp[0],fixZero(aTmp[1]),aTmp[2]]).join('-') <= sDate2){
          m++;
      } else {
          break;
      }
  }
  //计算天数
  aTmp = [aDate1[0]+y,aDate1[1]+m,aDate1[2]];
  if(aTmp[1] > 12){
      aTmp[0]++;
      aTmp[1] -= 12;
  }
  while(true){
      if(aTmp[2] == getMonthDays(aTmp[0],aTmp[1])){
          aTmp[1]++;
          aTmp[2] = 1;
      } else {
          aTmp[2]++;
      }
      sTmp = ([aTmp[0],fixZero(aTmp[1]),fixZero(aTmp[2])]).join('-');
      if(sTmp <= sDate2){
          d++;
      } else {
          break;
      }
  }
  return {y:y,m:m,d:d}
}

/**
* 判断日期中的那个月的天数
* @param time
*/
util.mGetDate = function (time){
  var date = new Date(time)
  var year = date.getFullYear()
  var month = date.getMonth()+1
  var d = new Date(year, month, 0)
  return d.getDate()
}

/**
 *  计算两个日期之间的天数
 * 
 */
util.dateDiff = function(sDate1, sDate2) { //sDate1和sDate2是2017-9-25格式 
  var aDate, oDate1, oDate2, iDays
  aDate = sDate1.split("-")
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为9-25-2017格式 
  aDate = sDate2.split("-")
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
  return iDays
}
/**
 *  计算两个日期的前后
 *  如果第一个值晚于第二个值则返回true，否则返回false
 */
util.compareDate = function(d1, d2) {
  return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

/**
* 时间戳格式化成事件字符串
* @param time
* @param fmt
*/
util.TimestampFormat = function (time, fmt = 'yyyy-MM-dd hh:mm:ss') {
  //author: meizz
  let _time = new Date(time);
  return TimeFormat(_time, fmt);
}

/**
* 时间戳 --> 时间字符串
* @param timestamp 例：'1524238633000' 或 '1425553097'
* @param type // true 转换到日 false 转换到秒
*/
util.timestampToDateString = function (timestamp, type = false) {
  // var timestamp = '1425553097';1524238633000
  if (!timestamp) { return; }
  let d;
  let time;
  if (typeof timestamp === 'number') {
      time = timestamp.toString();
  } else if (typeof timestamp === 'string') {
      time = timestamp
  } else {
      let num = timestamp.getTime();
      time = num.toString();
  }
  // 时间戳为10位需*1000，时间戳为13位（毫秒级）的话不需乘1000
  if (time.length === 10) {
      d = new Date(parseFloat(time) * 1000);
  } else if (time.length === 13) {
      d = new Date(parseFloat(time));
  }
  if (!d) { return; }
  if (type) {
      return timeToDay(d);
  } else {
      return timeFormat2(d);
  }
}

/**
 * 获取共用的信息
 *
 */
util.setCommonData = function () {
  // 获取所有的职位
  store.commit ('d2admin/loading/noAllowShow')
  GetPositionDic().then(res => {
      store.commit('d2admin/allUser/setPosition', res)
  })
  // 获取部门
  store.commit ('d2admin/loading/noAllowShow')
  getCompanyDepDic().then(res => {
      store.commit('d2admin/allUser/setDepart', res)
  })
  // 获取所有职员
  store.commit ('d2admin/loading/noAllowShow')
  staffStaffDictionary().then(res => {
      store.commit('d2admin/allUser/set', res)
  })
  // 获取权限树
  store.commit ('d2admin/loading/noAllowShow')
  GetLimitsTree().then(res => {
      store.commit('d2admin/role/set', res)
  })
  // 请求角色树
  store.commit ('d2admin/loading/noAllowShow')
  GetRoleTree().then(res => {
      store.commit('d2admin/allRole/set', res)
  })
}


/**
* 时间格式化 date类型 --> string字符串（yyyy-mm-dd hh:mm:ss）
* @param time date
*/
export function timeFormat2(time) {
  const yyyy = time.getFullYear();
  const MM = addZreo(time.getMonth() + 1);
  const dd = addZreo(time.getDate());
  const hh = addZreo(time.getHours());
  const mm = addZreo(time.getMinutes());
  const ss = addZreo(time.getSeconds());
  return yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
}

/**
* 时间戳转换为时间格式(到日)
* @param time 时间戳
* @returns {string}
*/
function timeToDay(time) {
  const yyyy = time.getFullYear();
  const MM = addZreo(time.getMonth() + 1);
  const dd = addZreo(time.getDate());
  return yyyy + "-" + MM + "-" + dd;
}
// 对象赋值
util.setObjval = function (arr1, arr2) {
    for (var key in arr2) {
        for (var item in arr1) {
            if (key === item) {
                arr1[item] = arr2[key];
            }
        }
    }
    return arr1;
};
// 金额转换
util.convertCurrency= function(money) {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '元';
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (money === '') {return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
      //超出最大处理数字
      return '';
    }
    if (money === 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;;
      return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
      integerNum = money;
      decimalNum = '';
    } else {
      parts = money.split('.');
      integerNum = parts[0];
      decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      var zeroCount = 0;
      var IntLen = integerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = integerNum.substr(i, 1);
        var p = IntLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (n == '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0];
          }
          //归零
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q];
        }
      }
      chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != '') {
      var decLen = decimalNum.length;
      for (var i = 0; i < decLen; i++) {
        var n = decimalNum.substr(i, 1);
        if (n != '0') {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (chineseStr == '') {
      chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
      chineseStr += cnInteger;
    }
    return chineseStr;
}

// 日期格式化 使用方法 new Date(date).format(转换格式) //yyyy-MM-dd hh:mm:ss
Date.prototype.format = function (format) {
  let args = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
      'S': this.getMilliseconds()
  };
  if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)); }
  for (let i in args) {
      let n = args[i];
      if (new RegExp('(' + i + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length)); }
  }
  return format;
};

// 账号显示**** 用于银行卡号隐藏 util.replaceAccount (‘字符串’，‘开始位置’，‘结束位置’，‘要替换的格式’)
util.replaceAccount = function(text,start,end,replacetext) {
  let mystr = '';
  mystr = text.substring(0,start)+replacetext+text.substring(end);
  return mystr;
}
// 时间补0
function addZreo(test) {
  if (test <= 9) {
      return "0" + test;
  } else {
      return test;
  }
}
util.oneOf = function (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}
util.confirm = function (title) {
  let titleVal = title || '此操作将永久删除该文件, 是否继续?';
  return MessageBox.confirm(titleVal, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    cancelButtonClass: "btn-custom-cancel",
    type: 'warning'
  }).then(() => {
    return true
  }).catch(() => {
    return false
  });
}
util.moneyFormat = function (value) {
  if (typeof (value) == 'number') {
    return value
  } else {
    if (value.indexOf(',') != -1) {
      return Number(value.replace(/[^0-9._-]/g, ''))
    } else {
      return Number(value)
    }
  }
}
util.moneyTransform = function (value) {
  value = value ? parseFloat(value.toString().replace(/[^0-9._-]/g, '')) || 0 : 0;
  let formattedValue = '';
  if (value !== 0 && value !== ''){
      formattedValue = Number(value)
              .toFixed(2)
              .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
  }else{
      formattedValue = value;
  }
  return formattedValue;
}
util.isDef = function (val) {
  return val !== undefined && val !== null && val !== '';
}
util.handleState = function (data) {
  let name = ''
  switch (data) {
    case '1':
      name = '初始化'
      break;
    case '2':
      name = '待审批'
      break;
    case '3':
      name = '审批中'
      break;
    case '4':
      name = '已驳回'
      break;
    case '5':
      name = '已作废'
      break;
    case '6':
      name = '待提交'
      break;
    case '10':
      name = '已完结'
      break;
  }
  return name
}
util.isDisabled = function (data) {
  let boolean = true
  switch (data) {
    case '1':
      boolean = false
      break
  }
  return boolean
}
/*
*  查询文件类型
*  返回 1文件夹 2word 3pdf 4txt 5excel 6zip 7img 8ppt 9未知
*/
util.getFileType = function (fileName) {
  let fileType = '9'
  // 三位后缀
  let three = fileName.substring(fileName.length-3, fileName.length).toLowerCase()
  if (three === 'doc' || three === 'dot' || three === 'wps') {
    fileType = '2'
  } else if (three === 'pdf') {
    fileType = '3'
  } else if (three === 'txt') {
    fileType = '4'
  } else if (three === 'xls') {
    fileType = '5'
  } else if (three === 'zip' || three === 'rar' || three === 'jar') {
    fileType = '6'
  } else if (three === 'jpg' || three === 'png' || three === 'gif') {
    fileType = '7'
  } else if (three === 'ppt') {
    fileType = '8'
  }
  // 四位后缀
  let four = fileName.substring(fileName.length-4, fileName.length).toLowerCase()
  if (four === 'docx') {
    fileType = '2'
  } else if (four === 'xlsx') {
    fileType = '5'
  } else if (four === 'jpeg') {
    fileType = '7'
  } else if (four === 'pptx') {
    fileType = '8'
  }
  return fileType
}

/**
 *  将数字改成 K M G
 * 
 */
util.nFormatter = function(num) {
  const si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "K" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
          break;
      }
  }
  // return (num / si[i].value).toFixed(2).replace(rx, "$1") + si[i].symbol;
  return util.moneyTransform((num / si[i].value)) + si[i].symbol
}


util.formatDuring = function (mss) {
  // var days = parseInt(mss / (1000 * 60 * 60 * 24));
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = (mss % (1000 * 60)) / 1000;
  return hours + " 时 " + minutes + " 分 " + seconds.toFixed(0) + " 秒 ";
  // return days + " 天 " + hours + " 时 " + minutes + " 分 " + seconds.toFixed(0) + " 秒 ";
}

util.inventoryStatus = function (data) {
  let name = ''
  switch (data) {
    case '0':
      name = '待入库'
      break;
    case '1':
      name = '部分入库'
      break;
    case '2':
      name = '已入库'
      break;
  }
  return name
}

// 加法
 util.addNum = function (num1, num2) {
    var sq1,sq2,m;
    try {
      sq1 = num1.toString().split(".")[1].length;
    }
    catch (e) {
      sq1 = 0;
    }
    try {
      sq2 = num2.toString().split(".")[1].length;
    }
    catch (e) {
      sq2 = 0;
    }
    m = Math.pow(10,Math.max(sq1, sq2));
    return (num1 * m + num2 * m) / m;
  }
// 减法
util.subtraction = function (arg1,arg2) {
    arg1 = arg1 || 0;
    arg2 = arg2 || 0;
    var r1,r2,m,n;  
    try{
      r1=arg2.toString().split(".")[1].length
    }
    catch(e){
      r1=0
    }  
    try{
      r2=arg1.toString().split(".")[1].length
    }
    catch(e){
      r2=0
    }  
    m=Math.pow(10,Math.max(r1,r2));  
    n=(r1>=r2)?r1:r2;  
  return (arg1*m-arg2*m)/m;  
}
// 乘法
util.accMul = function(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}
util.formatDuring = function (mss) {
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = (mss % (1000 * 60)) / 1000;
  return hours + " 时 " + minutes + " 分 " + seconds.toFixed(0) + " 秒 ";
}
util.moneySepFormat = function(number, decimals, dec_point, thousands_sep) {
  　　/*
  　　 * 参数说明：
  　　 * number：要格式化的数字
  　　 * decimals：保留几位小数
  　　 * dec_point：小数点符号
  　　 * thousands_sep：千分位符号
  　　 * */
  　　 number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  　　 var n = !isFinite(+number) ? 0 : +number,
  　　 prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
   　　sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
   　　dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
   　　s = '',
  　　 toFixedFix = function(n, prec) {
   　　　　var k = Math.pow(10, prec);
   　　　　return '' + Math.round(n * k) / k;
   　　};
   　　s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  　　 var re = /(-?\d+)(\d{3})/;
  　　 while(re.test(s[0])) {
   　　　　s[0] = s[0].replace(re, "$1" + sep + "$2");
   　　}
  
   　　if((s[1] || '').length < prec) {
      　　 s[1] = s[1] || '';
       　　s[1] += new Array(prec - s[1].length + 1).join('0');
   　　}
    　　　　return s.join(dec);
   }

export default util
