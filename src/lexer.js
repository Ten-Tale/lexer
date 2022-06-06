import { matchAny } from './helpers.js'

import t from "./TokenList.js";
import { customErrorList } from './TokenList.js';


const _parenthesesStack = [];
const _maxSquareParenthesesDepth = 2;
let _squareParenthesesDepthCounter = 0;


export function start(text) {
  if (text.match(t.symbols.regex)) {
    throw ({ message: t.symbols.errorMessage, text: text })
  }

  const temp = text.match(t.begin.regex)
  if (temp) {
    return checkMembers(text.substring(temp[0].length), true)
  }

  throw ({ message: t.begin.errorMessage, text: text })
}

function checkMembers(text, isFirstOccurance = false) {
  const temp = text.match(t.member.regex);
  if (temp) {
    return checkOperator(text.substring(temp[0].length), true)
  }

  if (isFirstOccurance) {
    throw ({ message: t.member.firstOccuranceErrorMessage, text: text })
  }

  throw ({ message: t.member.errorMessage, text: text })
}

function checkOperator(text, isFirstOccurance = false) {
  const temp = text.match(t.identificator.regex)

  if (temp) {
    const nextTokenText = text.substring(temp[0].length)

    if (nextTokenText.match(t.identificator.regex)) {
      return checkOperator(nextTokenText)
    }

    if (nextTokenText.match(t.colon.regex)) {
      return checkColon(nextTokenText)
    }

    throw ({ message: "Оператор должен начинаться с метки, состоящей из целых чисел", text: nextTokenText })
  }

  if (isFirstOccurance) {
    throw ({ message: t.identificator.firstOccuranceErrorMessage, text: text })
  }
  
  throw ({ message: t.identificator.errorMessage, text: text })
}

function checkColon(text) {
  const temp = text.match(t.colon.regex)

  if (temp) {
    return checkVariable(text.substring(temp[0].length))
  }

  throw ({ message: t.colon.errorMessage, text: text })
}

function checkVariable(text, isInRightPart = false) {
  const temp = text.match(t.variable.regex)

  if (temp && isInRightPart) {
    return checkSigns(text.substring(temp[0].length))
  }

  if (temp) {
    return checkAssign(text.substring(temp[0].length))
  }

  throw ({ message: t.variable.errorMessage, text: text })
}

function checkAssign(text) {
  const temp = text.match(t.assign.regex)

  if (temp) {
    return checkRightPart(text.substring(temp[0].length), false, true)
  }

  throw ({ message: t.assign.errorMessage, text: text })
}

function checkRightPart(text, isContinuing = false, isEmpty = false, parenthesesBefore = false) {
  
  if (matchAny(
        text, 
        t.openingCircleBracket.regex,
        t.openingSquareBracket.regex,
        t.closingCircleBracket.regex,
        t.closingSquareBracket.regex,
        t.variable.regex,
        t.integer.regex,
        t.plus.regex,
        t.minus.regex,
        t.multiply.regex,
        t.devide.regex,
        t.power.regex,
        t.end.regex,
        t.lineEnd.regex
      )) {

    if (isContinuing) {
      const temp = text.match(t.lineEnd.regex)

      if (temp) {
        const nextTokenList = text.substring(text.match(t.lineEnd.regex)[0].length);

        if (nextTokenList.match(t.member.regex)) {
          return checkMembers(nextTokenList)
        }

        if (nextTokenList.match(t.identificator.regex)) {
          return checkOperator(nextTokenList, true)
        }

        throw ({ message: "Оператор должен начинаться с метки, состоящей из целых чисел", text: nextTokenList })
      }

      if (text.match(t.end.regex)) {
        if (isEmpty) {
          throw ({ message: customErrorList.unexpectedValueInRigthPart, text: text })
        }
  
        return
      }
  
      if (text.length < t.end.name.length) {
        throw ({ message: t.end.errorMessage, text: text })
      }

      if (matchAny(
        text,
        t.plus.regex,
        t.minus.regex,
        t.multiply.regex,
        t.devide.regex,
        t.power.regex,
      )) {
        return checkSigns(text)
      }

      if(matchAny(
        text,
        t.openingCircleBracket.regex,
        t.closingCircleBracket.regex,
        t.openingSquareBracket.regex,
        t.closingSquareBracket.regex,
      )) {
        return checkParentheses(text)
      }
    
      throw ({ message: customErrorList.signExpected, text: text })
    }    

    if (text.match(t.variable.regex)) {
      return checkVariable(text, true)
    }

    if (text.match(t.integer.regex)) {
      return checkInteger(text)
    }

    if (parenthesesBefore) {
      if (text.match(t.end.regex)) {
        if (isEmpty) {
          throw ({ message: customErrorList.unexpectedValueInRigthPart, text: text })
        }
  
        return
      }
  
      if (text.length < t.end.name.length) {
        throw ({ message: t.end.errorMessage, text: text })
      }
    }

    if (matchAny(
      text, 
      t.closingCircleBracket.regex,
      t.closingSquareBracket.regex,
    )) {
      if (parenthesesBefore) {
        throw ({ message: customErrorList.emptyParentheses, text: text })
      }
      return checkParentheses(text)
    }

    if (matchAny(
      text, 
      t.openingCircleBracket.regex,
      t.openingSquareBracket.regex,
    )) {

      return checkParentheses(text)
    }
  }

  if (!isContinuing) {
    const temp = text.match(t.lineEnd.regex)

    if (temp) {
      const nextTokenList = text.substring(text.match(t.lineEnd.regex)[0].length)

      if (nextTokenList.match(t.member.regex)) {
        return checkMembers(nextTokenList)
      }

      if (nextTokenList.match(t.identificator.regex)) {
        return checkOperator(nextTokenList, true)
      }
    }

    if (text.match(t.end.regex)) {
      if (isEmpty) {
        throw ({ message: customErrorList.unexpectedValueInRigthPart, text: text })
      }

      return
    }

    if (text.length < t.end.name.length) {
      throw ({ message: t.end.errorMessage, text: text })
    }

    throw ({ message: customErrorList.unexpectedValueInRigthPart, text: text })
  }

  throw ({ message: customErrorList.unexpectedValueInRigthPart, text: text })
}

function checkSigns(text) {

  if (matchAny(
    text,
    t.openingCircleBracket.regex,
    t.closingCircleBracket.regex,
    t.openingSquareBracket.regex,
    t.closingSquareBracket.regex,
  )) {
    return checkParentheses(text) //TODO
  }


  if (matchAny(
    text, 
    t.plus.regex,
    t.minus.regex,
    t.multiply.regex,
    t.devide.regex,
    t.power.regex,
  )) {
    return checkRightPart(text[1] === ' ' ? text.substring(2) : text.substring(1))
  }


  throw ({ message: customErrorList.signExpected, text: text })
}

function checkInteger(text) {
  const temp = text.match(t.integer.regex)

  if (temp) {
    return checkRightPart(text.substring(temp[0].length),
      true, false, false)
  }

  throw ({ message: t.integer.errorMessage, text: text })
}

function checkParentheses(text) {

  if (text.match(t.openingCircleBracket.regex)) {
    _parenthesesStack.push(t.openingCircleBracket.symbol)


    return checkRightPart(text.substring(text.match(t.openingCircleBracket.regex)[0].length), false, false, true)
  }

  if (text.match(t.closingCircleBracket.regex)) {
    if (!_parenthesesStack.length) {
      throw ({ message: customErrorList.noOpeningParentheses, text: text })
    }

    if (_parenthesesStack[_parenthesesStack.length - 1] === t.openingCircleBracket.symbol) {
      _parenthesesStack.pop()
      return checkRightPart(text.substring(text.match(t.closingCircleBracket.regex)[0].length), true, false, false)
    }
    
    throw ({ message: customErrorList.noOpeningParentheses, text: text })
  }

  if (text.match(t.openingSquareBracket.regex)) {
    _squareParenthesesDepthCounter++;

    if (_squareParenthesesDepthCounter > _maxSquareParenthesesDepth) {
      throw ({ message: customErrorList.overMaxDepth, text: text })
    }

    _parenthesesStack.push(t.openingSquareBracket.symbol)
    return checkRightPart(text.substring(text.match(t.openingSquareBracket.regex)[0].length), false, false, true)
  }

  if (text.match(t.closingSquareBracket.regex)) {
    if (!_parenthesesStack.length) {
      throw ({ message: customErrorList.noOpeningParentheses, text: text })
    }

    if (_parenthesesStack[_parenthesesStack.length - 1] === t.openingSquareBracket.symbol) {
      _parenthesesStack.pop()
      _squareParenthesesDepthCounter--;
      return checkRightPart(text.substring(text.match(t.closingSquareBracket.regex)[0].length), true, false, false) 
    }
  
    throw ({ message: customErrorList.noOpeningParentheses, text: text })
  }
}