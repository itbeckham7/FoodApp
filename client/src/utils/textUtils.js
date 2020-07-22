export const textEllipsis = (value, overNum, tail) => {
  return value && value.length > overNum
  ? value.substring(0, overNum) + tail
  : value;
}

export const getTimeString = (value, format) => {
  if( value ){
    var timeVal = value == 'now' ? (new Date()) : (new Date(value))
    var str = timeVal.toString();
    console.log('-- str : ', str)
    str = str.split(' ');
    var dateStr = str[0];
    var dayStr = str[1];
    var monthStr = str[2];
    var yearStr = str[3];
    var timeStr = str[4];
    var timeArr = timeStr.split(':');
    var hour = timeArr[0];
    var minute = timeArr[1];
    var second = timeArr[2];
    var pStr = str[5]
    
    if( format == 'd m' ){
      return dayStr + ' ' + monthStr
    } else if( format == 'd d m' ){
      return dateStr + ' ' + dayStr + ' ' + monthStr
    } else if( format == 'd d m y' ){
      return dateStr + ' ' + dayStr + ' ' + monthStr + ' ' + yearStr
    } else if( format == 'd m, y' ){
      return dayStr + ' ' + monthStr + ', ' + yearStr
    } else if( format == 'h:m:s' ){
      return timeStr
    } else if( format == 'h:m p' ){
      return hour + ':' + minute
    } else if( format == 'm/d' ){
      return monthStr + '/' + dayStr
    } else {
      return str
    }
  }

  return ''
}
  
