import { start, clearList } from "./lexer.js"

const input = document.querySelector('#input')
const errorField = document.querySelector("#output")
const button = document.querySelector('#action')
const clear = document.querySelector('#clear')

clear.addEventListener("click", function() {
  input.innerHTML = ''
  errorField.innerText = ''
})

input.addEventListener("input", function() {
  errorField.innerText = ''
})

button.addEventListener("click", function() {
  const text = input.innerText
    .replace('<span class="error" contenteditable="false">', '')
    .replace('</span>', '')
    .replaceAll(/[\n\t]/g, " ")
    .replaceAll(/\s+/g, ' ')
  errorField.innerText = ''

  try {
    start(text)
    errorField.innerText = "Ошибок не обнаружено"
  } catch(err) {
    const context = err.text.split(' ')[0]

    clearList()

    input.innerHTML = input.innerHTML.replace(context ?? ' ', `<span class="error" contenteditable="false">${context ?? ' '}</span>`)


    errorField.innerText = err.message
  }
});