/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from '.';
import { context } from '@/pages';

jest.mock('@/components/Map', () => {
  return function DummyPages(props) {
    return <div>page</div>;
  };
});

jest.mock('@/components/Tooltip/content', () => {
  return function DummyPages(props) {
    return <div>Tooltip</div>;
  };
});

jest.mock('@/components/Tooltip/show', () => {
  return function removeExistingTooltip(arg) {
    return;
  };
});

describe('Rendering', () => {
  const _context: any = {};
  const mockSettings = {
    title: 'デジタル裾野',
    background_color: '#17a2b8',
  };
  _context.preferences = { settings: mockSettings };
  it('title in json', () => {
    const header = render(
      <context.Provider value={_context}>
        <Header />
      </context.Provider>
    );

    // jsonから取得したtitleが表示されている
    expect(header.getByText(mockSettings.title) instanceof HTMLElement).toBeTruthy();
  });
});
