let VariableList = []

function clearVarList() {
  VariableList = []
}

export function countRightPart(text) {
  clearVarList()
  const rpRegex = /\: ?(?<var>[а-я][0-7][0-7][0-7]) ?=((?<rightPart>.*));|: ?(?<var1>[а-я]\d\d\d) ?=(?<end>.*) ?конец/gim

  const resultList = [];
  const a = []
  
  const varArray = [...text.matchAll(rpRegex)]
    .map(item => item.groups?.var?.trim() ?? item.groups?.var1?.trim())

  varArray.forEach(item => {
    VariableList.push({key: item, value: null})
  })

  const rightPartArray = [...text.matchAll(rpRegex)]
    .map(item => item.groups?.rightPart?.trim() ?? item.groups?.end?.trim())

    
  rightPartArray.forEach((element, index) => {
    element = element.replaceAll(' ', '')

    let vars = [...element.matchAll(/[а-я][0-7][0-7][0-7]/gi)]
      .map(item => item[0])

    vars.forEach(item => {
      if (!VariableList.slice(0, index).some((el) => el.key === item)) {
        throw ({ message: 'Использована неинициализированная переменная', text: item })
      }
    })

    const cnt = (element.match(/[\]\)]/g) || []).length;
    
    let eqt = element
    let offset = 0
    
    for (let k = 0; k < cnt; k++) {
      let number = '';

      for (let i = 0; i < eqt.substring(offset).length; i++) {    
        if (eqt[i].match(/[\[\(]/)) {
          number = ''
          offset = i
          continue
        }

        if (eqt[i].match(/[\)\]]/)) break

        number = number.concat(eqt[i])
      }


      const r = count(number)

      if (r?.match(/^-?\d{1,}$/)) {
        eqt = eqt.replace(`(${number})`, r)
        eqt = eqt.replace(`[${number}]`, r)
        eqt = eqt.replace(number, r)
        offset = eqt.match(r)?.index + r.length - 1
        continue
      }
    
      offset = eqt.match(r[1]).index + r[1].length

    }

    resultList.push([index, eqt])
  });

  resultList.forEach((item, index) => {
    item = item[1].replaceAll('--', '+')
    if (item[0] === '+') item = item.substring(1)

    let amount = (item.match(/[\*\+\-\/\^]/g) || []).length;
    // if (item[0] === '-') {
    //   amount--
    // }

    if (amount == 0) {
      VariableList[index].value = count(item)
    }

    for (let i = 0; i < amount; i++) {
        VariableList[index].value = count(item)
    }
  })


  return VariableList
}

function count(text) {
  

  let vars = [...text.matchAll(/[а-я][0-7][0-7][0-7]/gi)]
      .map(item => item[0])

  vars.forEach((item) => {
    let i = -1;

    VariableList.forEach((el, index) => {
      if (el.key === item) {
        i = index
        return
      }
    })

    text = text.replaceAll(item, VariableList[i].value)
  })

  let eq = text

  let offset = 0

  const a = [...text.matchAll(/\^/g)]

  const powerOcc = (a || []).length

  
  for (let i = 0; i < powerOcc; i++) {
    const temp = countPower(eq.substring(offset))
    
    eq = eq.replace(temp[1], temp[0] ? temp[0] : temp[1])
    offset = temp[0] ? 0 : temp[1].length
  }
  
  const b = [...text.matchAll(/\*/g)]
  
  const multOcc = (b || []).length
  
  for (let i = 0; i < multOcc; i++) {
    const temp = countMult(eq.substring(offset))
    
    eq = eq.replace(temp[1], temp[0] ? temp[0] : temp[1])
    offset = temp[0] ? 0 : temp[1].length
  }
  
  const c = [...text.matchAll(/\//g)]
  
  const divideOcc = (c || []).length
  
  for (let i = 0; i < divideOcc; i++) {
    const temp = countDivide(eq.substring(offset))
    
    eq = eq.replace(temp[1], temp[0] ? temp[0] : temp[1])
    offset = temp[0] ? 0 : temp[1].length
  }
  
  eq = eq.replaceAll('--', '+')
  if (eq[0] === "+") eq = eq.substring(1)
  
  const d = [...text.matchAll(/\-/g)]
  
  const minusOcc = (d || []).length
  
  for (let i = 0; i < minusOcc; i++) {
    if (i !== 0 || text[0] !== '-') {
      const temp = countMinus(eq.substring(offset))
      
  
      eq = eq.replace(temp[1], temp[0] ? temp[0] : temp[1])
      offset = temp[0] ? 0 : temp[1].length
    }
  }
  
  const e = [...text.matchAll(/\+/g)]
  
  const plusOcc = (e || []).length
  
  for (let i = 0; i < plusOcc; i++) {
    const temp = countPlus(eq.substring(offset))

    eq = eq.replace(temp[1], temp[0] ? temp[0] : temp[1])
    offset = temp[0] ? 0 : temp[1].length
  }


  return eq
}

function countPower(text) {
  let numberStart = 0;

  let number = '';

  let number2 = '';

  let flag = false;

  for (let i = 0; i < text.length; i++) {

    if (!flag && text[i] === '^') {
      flag = true;
continue
    }
    
    if (text[i].match(/[\+\-\*\/]/) && !flag) {
      number = ''
      numberStart = i + 1
    }
    if (!flag) number = number.concat(text[i])
    

    if (flag) {
      if (text[i].match(/[\+\*\/\-\)\^]/)) {
        break;
      }

      number2 = number2.concat(text[i])
    }
  }

  if (number.match(/^-?\d{1,}/) && number2.match(/^-?\d{1,}$/)) {
    return [Math.pow(parseInt(number), parseInt(number2)).toString(), `${number}^${number2}`];
  }

  return [null, `${number}^${number2}`]
}

function countMult(text) {
  let numberStart = 0;

  let number = '';

  let number2 = '';

  let flag = false;

  for (let i = 0; i < text.length; i++) {    
    if (!flag && text[i] === '*') {
      flag = true;
continue
    }
    if (text[i].match(/[\]+\-\/]/) && !flag) {
      number = ''
      numberStart = i + 1
    }
    if (!flag) number = number.concat(text[i])
    

    if (flag) {
      if (text[i].match(/[\+\/\-\)\*]/)) {
        break;
      }

      number2 = number2.concat(text[i])
    }
  }

  if (number.match(/^-?\d{1,}/) && number2.match(/^-?\d{1,}$/)) {
    return [(parseInt(number) * parseInt(number2)).toString(), `${number}*${number2}`];
  }

  return [null, `${number}*${number2}`]
}

function countDivide(text) {
  let numberStart = 0;

  let number = '';

  let number2 = '';

  let flag = false;

  for (let i = 0; i < text.length; i++) {

    if (!flag && text[i] === '/') {
      flag = true;
continue
    }
    
    if (text[i].match(/[\+\-]/) && !flag) {
      number = ''
      numberStart = i + 1
    }
    if (!flag) number = number.concat(text[i])
    

    if (flag) {
      if (text[i].match(/[\+\-\)\/]/)) {
        break;
      }

      number2 = number2.concat(text[i])
    }
  }

  if (number.match(/^-?\d{1,}/) && number2.match(/^-?\d{1,}$/)) {
    return [parseInt(parseInt(number) / parseInt(number2)).toString(), `${number}/${number2}`];
  }

  return [null, `${number}/${number2}`]
}

function countMinus(text) {
  let numberStart = 0;

  let number = '';

  let number2 = '';

  let flag = false;

  for (let i = 0; i < text.length; i++) {

    if (!flag && text[i] === '-' && i !== 0) {
      flag = true;
      continue
    }
    
    if (text[i].match(/\+/) && !flag) {
      number = ''
      numberStart = i + 1
    }
    if (!flag) number = number.concat(text[i])
    

    if (flag) {
      if (text[i].match(/[\+\)\-]/)) {
        break;
      }

      number2 = number2.concat(text[i])
    }
  }

  if (!number) number = '0'

  if (number.match(/^-?\d{1,}/) && number2.match(/^\d{1,}$/)) {
    return [(parseInt(number) - parseInt(number2)).toString(), `${number}-${number2}`];
  }



  return [null, `${number}-${number2}`]
}

function countPlus(text) {
  let numberStart = 0;

  let number = '';

  let number2 = '';

  let flag = false;

  for (let i = 0; i < text.length; i++) {

    
    if (!flag && text[i] === '+') {
      flag = true;
      continue
    }
  
    if (!flag) number = number.concat(text[i])
    
    if (flag) {
      if (text[i].match(/[\+\)]/)) {
        break;
      }

      number2 = number2.concat(text[i])
    }
  }

  if (number.match(/^-?\d{1,}/) && number2.match(/^-?\d{1,}$/)) {

    return [(parseInt(number) + parseInt(number2)).toString(), `${number}+${number2}`];
  }

  return [null, `${number}+${number2}`]
}