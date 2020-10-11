import {waitFor,} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect';
import "regenerator-runtime/runtime.js";
import {Polygloat} from "../src";
import mockTranslations from "./mockTranslations";

import fetchMock from "jest-fetch-mock";

const API_URL = "http://localhost";
const API_KEY = "dummyApiKey";

const fetch = fetchMock.mockResponse(async req => {
    if (req.url === API_URL + "/uaa/scopes?ak=" + API_KEY) {
        return "[\"translations.edit\",\"translations.view\",\"sources.edit\"]";
    }

    if (req.url === API_URL + "/uaa/en?ak=" + API_KEY) {
        return JSON.stringify(mockTranslations);
    }

    throw new Error("Invalid request");
});

test('it evaluates document properly', async () => {
    let htmlDivElement = document.createElement("div");
    htmlDivElement.textContent = "{{hello_world}}"

    const el = document.evaluate("./descendant-or-self::*[text()[contains(., '{{') and contains(., '}}')]]", htmlDivElement, null, 0).iterateNext()
    expect(el).not.toBeNull();
});


test('it translates some existing text', async () => {
    fetch.enableMocks();
    Error.stackTraceLimit = 50;

    document.body.innerHTML = "{{hello_world}}"

    const polygloat = new Polygloat({
        targetElement: document.body,
        apiKey: API_KEY,
        apiUrl: API_URL,
        inputPrefix: "{{",
        inputPostfix: "}}",
    });

    await polygloat.run().then();

    await waitFor(() => {
            return expect(fetch.mock.calls.length).toEqual(2);
        }
    );

    const el = document.evaluate(".//*[contains(text(), 'Hello world!')]", document.body, null, 0).iterateNext();
    expect(el).toBeInTheDocument();
})
