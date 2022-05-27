import { useState } from 'react';
import { filterLayerNameInputText } from "@/components/LayerFilter/menu"

export const RefinementInput = () => {

    const [refinementKeyword, setRefinementKeyword] = useState('');

    // 入力された値をstate保持させる関数
    const handleRefinementKeywordChange = e => {
        setRefinementKeyword(e.target.value);
    };

    // 絞り込みボタン押下
    const handlerOnSubmitSearch = (e) => {
        e.preventDefault();
        console.log(filterLayerNameInputText(refinementKeyword));

        // メニュー内容の変更
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