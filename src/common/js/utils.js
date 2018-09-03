let utils = {
  /*
  函数，加法函数，用来得到精确的加法结果
  说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
  调用：Calc.Add(arg1,arg2,d)
  返回值：两数相加的结果
  */
  add: function (arg1, arg2) {
    arg1 = arg1.toString(), arg2 = arg2.toString();
    var arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
    var maxLen = Math.max(d1.length, d2.length);
    var m = Math.pow(10, maxLen);
    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
    var d = arguments[2];
    return typeof d === "number" ? Number((result).toFixed(d)) : result;
  },
  /*
  函数：减法函数，用来得到精确的减法结果
  说明：函数返回较为精确的减法结果。
  参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
  调用：Calc.Sub(arg1,arg2)
  返回值：两数相减的结果
  */
  subtract: function (arg1, arg2) {
    return Calc.Add(arg1, -Number(arg2), arguments[2]);
  },
  /*
  函数：乘法函数，用来得到精确的乘法结果
  说明：函数返回较为精确的乘法结果。
  参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
  调用：Calc.Mul(arg1,arg2)
  返回值：两数相乘的结果
  */
  multiply: function (arg1, arg2) {
    var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
    m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
    resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  /*
  函数：除法函数，用来得到精确的除法结果
  说明：函数返回较为精确的除法结果。
  参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
  调用：Calc.Div(arg1,arg2)
  返回值：arg1除于arg2的结果
  */
  divide: function (arg1, arg2) {
    var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
    m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
    resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  /*
  函数：时间格式化函数
  说明：
  参数：
  调用：
  返回值：
  */
  formatDate: function (date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : utils.padLeftZero(str)
        );
      }
    }
    return fmt;
  },
  /*
  函数：时间补零函数
  说明：
  参数：
  调用：
  返回值：
  */
  padLeftZero: function (str) {
    return ("00" + str).substr(str.length);
  },
  /*
  函数：搜索关键字高亮函数
  说明：
  参数：string：需要匹配的数据（string类型），searchInput：搜索的关键字（string类型），attribute：css样式属性（）,value：css相对应的属性值
  调用：
  返回值：
  */
  searchHighlight:function (string,searchInput,attribute,value) {
    let replaceReg=new RegExp(searchInput, 'ig');
    let replaceString=`<span style=${attribute+":"+value}>${searchInput}</span>`;
    return string.replace(replaceReg,replaceString)
  }
};
export default utils
