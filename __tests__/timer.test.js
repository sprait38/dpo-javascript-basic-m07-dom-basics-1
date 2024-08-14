const { JSDOM } = require('jsdom');
const { resolve } = require('path');
const path = resolve(__dirname, '../src/timer/index.html');

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

function initializeTimer(window) {
  const input = window.document.querySelector('input');
  const button = window.document.querySelector('button');
  input.value = '30';
  button.click();
}

jest.useFakeTimers();

test('на странице выводятся input, button и div', async () => {
  const { window } = await loadPage();
  expect(window.document.querySelector('input')).toBeInstanceOf(window.HTMLInputElement);
  expect(window.document.querySelector('button')).toBeInstanceOf(window.HTMLButtonElement);
  expect(window.document.querySelector('div')).toBeInstanceOf(window.HTMLDivElement);
});

test('ввод числа в input и нажатие на кнопку запускает таймер с введённым числом', async () => {
  const { window } = await loadPage();
  const div = window.document.querySelector('div');
  initializeTimer(window);
  expect(div.innerHTML).toStrictEqual('30');
});

test('таймер доходит до 0 и останавливается', async () => {
  const { window } = await loadPage();
  initializeTimer(window);
  jest.runAllTimers();
  const div = window.document.querySelector('div');
  expect(div.innerHTML).toStrictEqual('0');
});
