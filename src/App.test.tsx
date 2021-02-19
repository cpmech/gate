/* eslint-disable import/first */
global.window.scroll = jest.fn();
global.window.scrollTo = jest.fn();

import { sleep } from '@cpmech/basic';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { App } from './App';
import { store } from './service';

describe('App', () => {
  it('should render the Header', async () => {
    store.loadTopic('data');
    await sleep(50);

    await act(async () => {
      render(<App />);
    });

    const element = screen.getByRole('heading', { name: 'Dorival Pedroso' });
    expect(element).toBeInTheDocument();
  });
});
