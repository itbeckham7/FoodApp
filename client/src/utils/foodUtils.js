export const getTrans = (food, lang) => {
  if( food && lang && food.trans && food.trans.length>0 && lang ){
    for( var i=0; i<food.trans.length; i++ ){
      if( food.trans[i].abbr === lang ){
        return food.trans[i];
      }
    }
  }

  return null;
}
