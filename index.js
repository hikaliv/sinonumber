'use strict'

const SinoNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const SinoCapsNumber = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾']
const SinoTens = { 2: '廿', 3: '卅', 4: '卌' }
const SinoItor = ['', '十', '百', '千']
const SinoCapsItor = ['', '拾', '佰', '仟']
const SinoJtor = ['', '万', '亿', '兆']
const SinoCapsJtor = ['', '萬', '億', '佻']
const SinoKtor = ['', '亿', '兆']
const SinoCapsKtor = ['', '億', '佻']

/**
 * option = {
 *   jishi:bool, 是用廿表示二十，还是用二十表示
 *   wanyi:bool, 兆表示一万亿还是一亿亿
 *   da:bool,    是否大写
 *   yi:bool,    是写为一十，还是十，是写为一百，还是百
 *   er:bool,    是写为二百，还是两百
 *   chu:bool,   是否写为初几
 * }
 */
function numberToSino(number, option) {
  if (!Number.isInteger(number)) throw new TypeError('数字换算为汉字时，首参数非整数')
  if (!(option === undefined
    // 拒掉 null、函数、数组
    || (option instanceof Object) && typeof option == 'object' && !Array.isArray(option)
    && (option.jishi === undefined || typeof option.jishi == 'boolean')
    && (option.wanyi === undefined || typeof option.wanyi == 'boolean')
    && (option.da === undefined || typeof option.da == 'boolean')
    && (option.yi === undefined || typeof option.yi == 'boolean')
    && (option.er === undefined || typeof option.er == 'boolean')
    && (option.chu === undefined || typeof option.chu == 'boolean'))) {
    throw new TypeError('数字换算为汉字时，第二参数对像各属性应为真值')
  }
  if (number == 0) return '零'
  const prefix = number < 0 ? '负' : ''
  let num = number < 0 ? -number : number
  const opts = option || {}
  return `${prefix}${num <= 10 ? singleDigit(num, opts) : (opts.wanyi ? wanyizhao : yiyizhao)(num, opts)}`
}

function singleDigit(number, option) {
  const sinoNumber = option.da ? SinoCapsNumber : SinoNumber
  return `${option.chu ? '初' : ''}${sinoNumber[number]}`
}

/**
 * 以八位为一节，每一节一次最高进位，第一个八位为一亿，第二个八位为一兆
 * 每个八位内，从一到万到千万
 */
function yiyizhao(number, option) {
  const sinoJtor = option.da ? SinoCapsJtor : SinoJtor
  const sinoKtor = option.da ? SinoCapsKtor : SinoKtor
  /**
   * jtor 一亿内的两个万段
   * ktor 八位为一段，第一个八位为一亿，第二个八位为一兆
   */
  let ktor = 0, jtor = 0
  let remain = number, literal = '', chapter = ''
  const cache = () => {
    if (!chapter && literal && literal[0] != '零') {
      literal = `零${literal}`
    } else if (chapter) {
      chapter = replaceLiang(chapter, option, ktor)
      literal = join(chapter, sinoKtor[ktor], literal, option.yi)
    }
  }
  while (remain > 0) {
    const current = remain % 1e4
    remain = (remain - current) / 1e4
    if (current > 0) {
      const segment = replaceLiang(inWan(current, option, remain > 0), option, jtor)
      chapter = join(segment, sinoJtor[jtor], chapter, option.yi)
    }
    jtor++
    if (jtor == 2) {
      cache()
      jtor = 0
      ktor++
      chapter = ''
    }
  }
  if (chapter) cache()
  return literal
}

/**
 * 以四位为一节，每一节一次最高进位，第一个四位为一万，第二个四位为一亿，第三个四位为一兆
 * 每个四位内，从一到千
 */
function wanyizhao(number, option) {
  const sinoJtor = option.da ? SinoCapsJtor : SinoJtor
  // jtor 四位为一段，第一段为一万，第二段为一亿，第三段为一兆
  let jtor = 0, remain = number, literal = ''
  while (remain > 0) {
    const current = remain % 1e4
    remain = (remain - current) / 1e4
    if (current > 0) {
      const segment = replaceLiang(inWan(current, option, remain > 0), option, jtor)
      literal = join(segment, sinoJtor[jtor], literal, option.yi)
    }
    jtor++
  }
  return literal
}

function join(former, middle, latter, yi) { return middle ? (!yi && (former == SinoNumber[1] || former == SinoCapsNumber[1]) ? `${middle}${latter}` : `${former}${middle}${latter}`) : former }

function inWan(number, option, left) {
  const sinoNumber = option.da ? SinoCapsNumber : SinoNumber
  const sinoItor = option.da ? SinoCapsItor : SinoItor
  // itor 万以内，数个十百千
  let canzero = false, itor = 0, segment = '', remain = number
  while (remain > 0) {
    const current = remain % 10
    remain = (remain - current) / 10
    if (current != 0) {
      // 十位，若个位不为零，则由设置，20 是写为廿，还是二十
      if (itor == 1 && segment && !option.jishi && SinoTens[current]) segment = `${SinoTens[current]}${segment}`
      // 不在个位上的 1，由设置是写出来，还是略掉
      else if (current == 1 && itor != 0) segment = `${option.yi ? sinoNumber[1] : ''}${sinoItor[itor]}${segment}`
      // 百位和千位上的二，由设置是否换成两
      else if (current == 2 && (itor == 2 || itor == 3)) segment = `${option.er ? sinoNumber[2] : '两'}${sinoItor[itor]}${segment}`
      else segment = `${sinoNumber[current]}${sinoItor[itor]}${segment}`
      canzero = true
    } else {
      if (canzero) segment = `零${segment}`
      canzero = false
    }
    itor++
  }
  if (left && number < 1e3) segment = `零${segment}`
  return segment
}

function replaceLiang(segment, option, itor) {
  const sinoer = (option.da ? SinoCapsNumber : SinoNumber)[2]
  return (segment == sinoer || segment == `零${sinoer}`) && !option.er && itor > 0 ? `${segment.substr(0, segment.length - 1)}两` : segment
}

module.exports = { numberToSino }