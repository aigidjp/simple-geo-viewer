/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from '.';
import settings from '@/assets/settings.json';

describe('Rendering', () => {
  it('title in json', () => {
    const header = render(<Header />);

    // jsonから取得したtitleが表示されている
    expect(header.getByText(settings.title) instanceof HTMLElement).toBeTruthy();
  });
});
