import { createContext, useState } from "react";

export const RefinementKeywordContext = createContext('');

/*
export const RefinementKeywordProvider = (props) => {
  const [refinementKeyword, setInputRefinementKeyword] = useState('');
  return(
    <RefinementKeywordContext.Provider value={refinementKeyword}>
      {props.children}
    </RefinementKeywordContext.Provider>
  )
}
*/