import { useState, useContext } from 'react';
import { filterLayerNameInputText } from "@/components/LayerFilter/menu"
import { RefinementKeywordContext } from "@/components/SideBar/Content/RefinementKeywordProvider"

export const RefinementInput = () => {

    const [InputRefinementKeyword, setInputRefinementKeyword] = useState('');
    const {refinementKeyword, setRefinementKeyword} = useContext(RefinementKeywordContext);

    // 入力された値をstate保持させる関数
    const handleRefinementKeywordChange = e => {
        setInputRefinementKeyword(e.target.value);
    };

    // 絞り込みボタン押下
    const handlerOnSubmitSearch = (e) => {
        e.preventDefault();
        // プロバイダーの値変更
        setRefinementKeyword(InputRefinementKeyword);
    }

    return (
        <>
        <div className="">
            <form onSubmit={handlerOnSubmitSearch} className="text-left w-full mb-5 flex">
                <input
                    type="search"
                    name="query"
                    className="rounded py-2 px-4 text-left border-2 border-black w-5/6 flex"
                    placeholder="絞込するキーワードを入力して下さい"
                    onChange={handleRefinementKeywordChange}
                />
                <button className="ml-2 text-white bg-blue-500 rounded hover:opacity-75 w-1/6">
                    絞込
                </button>
            </form>
        </div>
        </>
    );
};