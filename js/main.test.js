'use strict'
const fs = require('fs')

jest.mock('./fetch.js')
import FetchPokemonData from "./fetch.js"

const mockFetch = jest.fn((id, callback) => {
    callback({
        id: id,
        name: `pokemon-${id}`,
        imgSrc: './public/images/pokeball.png'
    });
});

beforeAll(async () => {
    document.body.innerHTML = fs.readFileSync('./index.html', {encoding:"utf-8"});
    require('./main.js');
    
    FetchPokemonData.mockImplementation(mockFetch);
    
    await new Promise((r) => setTimeout(r, 500));
})


test('Dom Rendering', () => {
    expect(document.querySelector('#headerTitle').children[0].textContent).toBe('The Pokémon Index');
})


test('10 Entry Render', async () => {
    // Check to see if all 10 (default value) pokemon entries got rendered to screen
    expect(document.querySelector('#dexContainer').children.length).toBe(10);
})

test('Next Entries', async () => {
    const nextPageButton = document.querySelector('.NextButton');
    nextPageButton.click()
    await new Promise((r) => setTimeout(r, 500));
    // Checking to see if the last call made to the mock fetch was for pokemon id 20 (page turn last pokemon call)
    expect(mockFetch.mock.calls[mockFetch.mock.calls.length - 1][0]).toBe(20);
})

test('More Entries', async () => {
    const countSelector = document.querySelector('.cardCountSelect');
    countSelector.value = '20';
    countSelector.dispatchEvent(new Event('change'))
    // Checking to see if last batch of calls ended with id 30 (last test moved start to 11, so 11 + 19 = 30)
    expect(mockFetch.mock.calls[mockFetch.mock.calls.length - 1][0]).toBe(30);
})