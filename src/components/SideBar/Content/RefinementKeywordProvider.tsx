import { createContext, useCallback, useState } from "react";

// set context type
type RefinementKeywordContext = {
  refinementKeyword: String;
  setKeyword: (keyword: String) => void;
};

const defaultContext: RefinementKeywordContext = {
  refinementKeyword: '',
  setKeyword: () => {},
}

export const refinementKeywordContext = createContext<RefinementKeywordContext>(defaultContext);

export const useRefinementKeyword = (): RefinementKeywordContext => {
  const [refinementKeyword, setInputRefinementKeyword] = useState('');
  const setKeyword = useCallback((current): void => {
    setInputRefinementKeyword(current);
  },[]);
  return {
    refinementKeyword,
    setKeyword
  };
}