const { JSDOM } = require('jsdom');
const { resolve } = require('path');
const path = resolve(__dirname, '../src/input-with-delay/index.html');

function loadPage() {
  return JSDOM.fromFile(path, {
    url: `file://${path}`,
    runScripts: 'dangerously',
    resources: 'usable',
  }).then(dom => {
    if (dom.window.document.querySelector('script[src]')) {
      return new Promise((resolve) => {
        dom.window.addEventListener('DOMContentLoaded', () => resolve(dom));
      });
    }
    return dom;
  });
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

jest.useFakeTimers();

test('на странице выводятся input и h2', async () => {
  const { window } = await loadPage();
  expect(window.document.querySelector('input')).toBeInstanceOf(window.HTMLInputElement);
  expect(window.document.querySelector('h2')).toBeInstanceOf(window.HTMLElement);
});
