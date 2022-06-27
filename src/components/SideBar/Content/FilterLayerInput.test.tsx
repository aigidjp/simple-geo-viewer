/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FilterLayerInput } from './FilterLayerInput';

describe('Rendering', () => {
  it('button click', () => {
    let returnvalue: string = '';

    const mockSetFilterKeyword = jest.fn().mockImplementation((text: string) => {
      returnvalue = text;
    });
    const filterLayerInput = render(<FilterLayerInput setFilterKeyword={mockSetFilterKeyword} />);

    // ボタンとテキストエリアが存在する
    const button = filterLayerInput.getByRole('button');
    const textarea = filterLayerInput.getByRole('searchbox') as HTMLInputElement;

    // ボタンをクリックすると引数の関数が実行される
    button.click();
    expect(mockSetFilterKeyword).toHaveBeenCalledTimes(1);
    expect(returnvalue).toBe('');

    // 引数の関数にはテキストエリアの入力文字列が引数として渡される
    fireEvent.change(textarea, { target: { value: 'sampletext' } });
    button.click();
    expect(mockSetFilterKeyword).toHaveBeenCalledTimes(2);
    expect(returnvalue).toBe('sampletext');
  });
});
