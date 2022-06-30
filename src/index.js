import { start, clearList } from "./lexer.js"

import { countRightPart } from "./countRightPart.js"

const input = document.querySelector('#input')
const errorField = document.querySelector("#output")
const button = document.querySelector('#action')
const clear = document.querySelector('#clear')

clear.addEventListener("click", function() {
  input.innerHTML = ''
  errorField.innerText = ''
})

input.addEventListener("focus", function() {
  input.innerHTML = input.innerHTML.replace('<mark>', '')
  .replace('</mark>', '')

  document.getSelection().removeAllRanges()
})

input.addEventListener("input", function() {
  errorField.innerText = ''
})

button.addEventListener("click", function() {
  const text = input.innerText
    .replaceAll(/[\n\t]/g, " ")
    .replaceAll(/\s+/g, ' ')
  errorField.innerText = ''

  try {
    start(text)
    errorField.innerText = "Ошибок не обнаружено"
    const variableList = countRightPart(text)

    variableList.forEach(({key, value}) => {
      errorField.innerText += '\n' + key + ' = ' + value
    })
  } catch(err) {
    console.warn(err);
    const context = err.text.split(' ')[0]

    clearList()

    let range = document.createRange()

    if (context.length !== 0) {
      
      input.childNodes.forEach((line) => {
        const currentValue = line?.firstChild ? line.firstChild?.nodeValue ?? '' : line?.nodeValue ?? ''
        if (currentValue.indexOf(context) !== -1) {

          const selectionStartIndex = currentValue.indexOf(context)

          range.setStart(line?.firstChild ?? line, selectionStartIndex)
          range.setEnd(line?.firstChild ?? line, selectionStartIndex + context.length)
          
          
          return
        }
      })
  
  
    } else {
      range.setStart(input.lastChild.firstChild, input.lastChild.firstChild.length - 2)
      range.setEnd(input.lastChild.firstChild, input.lastChild.firstChild.length - 1)
    }

    const mark = document.createElement('mark')
    range.surroundContents(mark)

    errorField.innerText = err.message
  }
});