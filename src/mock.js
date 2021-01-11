import Mock from 'mockjs'
const Random = Mock.Random;
function getData(){
    let datalist= [];

    for (let i = 0; i < 100; i++) {
        let newData = {

            id:i,
            title: Random.csentence(5, 10), //  Random.csentence( min, max )
            datetime:Random.date() + ' ' + Random.time(), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
            site: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
            compere: Random.cname(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
            notekeeper:Random.cname(),
            state:Random.cname(),
            number:Random.int(0,10),

        }
        datalist.push(newData)
    }
    return {
        data: datalist
    }
}
const data = Mock.mock('/msg1',getData)
export default {data};