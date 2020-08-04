export const getCatTrans = (category, lang) => {
  if( category && lang && category.trans && category.trans.length>0 && lang ){
    for( var i=0; i<category.trans.length; i++ ){
      if( category.trans[i].abbr === lang ){
        return category.trans[i];
      }
    }
  }

  return null;
}
