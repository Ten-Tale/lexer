export default {
  begin: {
    regex: /^ ?Программа ?/i,
    errorMessage: "Язык должен начинаться со строки \"Программа\"",
    name: "Программа"
  },
  end: {
    regex: /^Конец/i,
    errorMessage: "Язык должен завершаться строкой \"Конец\"",
    name: "Конец",
  },
  
  member: {
    regex: /^ввод текста ?/i,
    errorMessage: "Допущена ошибка в звене",
    firstOccuranceErrorMessage: "После строки \"Программа\" должно идти звено, начинающееся с  \"ввод текста\"",
    name: "Звено",
  },
  identificator: {
    regex: /^[0-7]+ ?/i,
    errorMessage: "Допущена ошибка в метке",
    firstOccuranceErrorMessage: "В операторе должна присутствовать хотя бы одна метка формата Циф Циф Циф",
    afterErrorMessage: "После метки допустимо использование терминала \"Метка\" или знака \":\"",
    name: "Метка",
  },
  variable: {
    regex: /^[а-я][0-7]{3}[\s\=]/i,
    errorMessage: "Переменная отсутствует или имеет некорректный формат. Корректный формат (Буква Циф Циф Циф)",
    name: "Переменная",
  },
  colon: {
    regex: /^: ?/i,
    errorMessage: "За последней меткой должен следовать знак \":\"",
    name: ":",
  },
  assign: {
    regex: /^= ?/i,
    errorMessage: "Ошибка! После переменной должен следовать знак \"=\"",
    name: "=",
  },
  openingCircleBracket: {
    regex: /^\( ?/i,
    errorMessage: "У открывающей круглой скобки нет соответствующей пары",
    name: "Открывающая круглая скобка",
    symbol: "(",
  },
  closingCircleBracket: {
    regex: /^\) ?/i,
    errorMessage: "У закрывающей круглой скобки нет соответствующей пары",
    name: "Закрывающая круглая скобка",
    symbol: ")",
  },
  openingSquareBracket: {
    regex: /^\[ ?/i,
    errorMessage: "У открывающей квадратной скобки нет соответствующей пары",
    name: "Открывающая квадратная скобка",
    symbol: "[",
  },
  closingSquareBracket: {
    regex: /^\] ?/i,
    errorMessage: "У закрывающей квадратной скобки нет соответствующей пары",
    name: "Закрывающая квадратная скобка",
    symbol: "]",
  },
  plus: {
    regex: /^\+ ?/i,
    errorMessage: "Допущена ошибка при использовании оператора \"+\"",
    name: "+",
  },
  minus: {
    regex: /^- ?/i,
    errorMessage: "Допущена ошибка при использовании оператора \"-\"",
    name: "-",
  },
  multiply: {
    regex: /^\* ?/i,
    errorMessage: "Допущена ошибка при использовании оператора \"*\"",
    name: "*",
  },
  devide: {
    regex: /^\/ ?/i,
    errorMessage: "Допущена ошибка при использовании оператора \"/\"",
    name: "/",
  },
  power: {
    regex: /^\^ ?/i,
    errorMessage: "Допущена ошибка при использовании оператора \"^\"",
    name: "^",
  },
  integer: {
    regex: /^[0-7]+ ?/i,
    errorMessage: "Некорректное использование оператора \"Цел\"",
    name: "Цел",
  },
  space: {
    regex: /[\s\t\n]/i,
    errorMessage: "",
    name: "Разделитель",
  },
  symbols: {
    regex: /[^а-я0-7 \*\/\\+-\:\=\(\)\[\]\;]/i,
    errorMessage: "Использованы недопустимые символы",
    name: "",
  },
  lineEnd: {
    regex: /^; ?/i,
    errorMessage: "Некорректное использование разделителя \";\"",
    name: ";",
  },
}

export const customErrorList = {
  signExpected: "Ожидался один из знаков операций",
  emptyRightPart: "Правая часть не может быть пустой",
  unexpectedValueInRigthPart: "Некорректное значение в правой части",
  overMaxDepth: "Превышена максимальная допустимая глубина вложенности квадратных скобок",
  noOpeningParentheses: "В скобках обнаружено несоответствие",
  emptyParentheses: "Скобки не могут быть пустыми"
}