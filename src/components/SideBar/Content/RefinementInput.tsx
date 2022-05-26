import {
    Dispatch,
    memo,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
    VFC,
} from 'react';

export const RefinementInput = () => {

    // キーワードを格納
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [keyword, setKeyword] = useState('');

    // キーワードの変更を監視
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (keyword === '') return

        const params = { keyword: keyword }
        const query = new URLSearchParams(params)

    }, [keyword]);


    const handlerOnSubmitSearch = (e) => {
        e.preventDefault()

        const { currentTarget = {} } = e
        const fields = Array.from(currentTarget?.elements);

        console.log("aaaaaaaaaaaaaaaaaaa");
        const fieldQuery = fields.find((field) => field.name === 'query')
        // keywordをセット
        const value = fieldQuery.value || ''
        setKeyword(value);
    }

    return (
        <>
        <div className="">
            <form onSubmit={handlerOnSubmitSearch} className="text-left w-full mb-5 flex">
                <input
                    type="search"
                    name="query"
                    className="rounded py-2 px-4 text-left border-2 border-black w-5/6 flex"
                    placeholder="検索ワードを入力して下さい"
                />
                <button className="ml-2 text-white bg-blue-500 rounded py-2 px-6 hover:opacity-75 w-1/6 flex">
                    検索
                </button>
            </form>
        </div>
        </>
    );
};