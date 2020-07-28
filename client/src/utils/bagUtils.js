export const getExtraPrice = (bagExtras) => {
  var price = 0;

  if( bagExtras && bagExtras.length>0 ){
    bagExtras.map((extra)=>{
      var arr = extra.split('-');
      if( arr.length == 3 )
        price += parseFloat(arr[2])
    })
  }

  return price;
}
