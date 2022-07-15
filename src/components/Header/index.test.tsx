/**
 * @jest-environment jsdom
 */
 import React, { createContext, useState } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from '.';
import settings from '@/assets/settings.json';
import { MockedMap } from '@/components/Map';
import { MockedTooltip } from '@/components/Tooltip/content';
import { MockedremoveExistingTooltip } from '@/components/Tooltip/show';
import { context, TContext } from '@/pages';
import { Tooltip } from '../Tooltip/content';

jest.mock('@/components/Map', () => {
  return function DummyPages(props) {
    return (
      <div>
        page
      </div>
    );
  };
});

jest.mock('@/components/Tooltip/content', () => {
  return function DummyPages(props) {
    return (
      <div>
        Tooltip
      </div>
    );
  };
});

jest.mock('@/components/Tooltip/show', () => {
  return function removeExistingTooltip(arg) {
    return;
  };
});

describe('Rendering', () => {
  const _context = {} as TContext;
  _context.settings = settings
  it('title in json', () => {
    const header = render(
      <context.Provider value={_context}>
        <Header />
      </context.Provider>
    );

    // jsonから取得したtitleが表示されている
    expect(header.getByText(settings.title) instanceof HTMLElement).toBeTruthy();
  });
});
