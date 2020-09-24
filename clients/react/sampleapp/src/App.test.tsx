import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import 'mutationobserver-shim';

global.fetch = jest.fn(() => {
    return Promise.resolve({
        json: () => {
            return {
                hello: "Hello world!",
            }
        },
    });
});

global.window.postMessage = jest.fn(() => {
    return null;
});

test('renders learn react link', async () => {
    const app = render(<App/>);
    await app.findAllByDisplayValue("En");
    expect(fetch).toBeCalled();
    app.findByText("Hello world!");
});
