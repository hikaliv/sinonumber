汉字数
====
将整型数用汉字表示

安装
---
    npm install --save sinonumber

接口
---

### numberToSino(number: int, option: object)

#### 引用
    import { numberToSino } from 'sinonumber'
或

    const sinonumber = require('sinonumber')
    const { numberToSino } = sinonumber
#### 参数
##### number
整型值，待转化的数字
##### option
可选参数，若传入此参，可选三个属性
###### option.da
真值，汉字是否大写  
比如：

    const hanzi = numberToSino(10000)
    // hanzi = 一万

    const hanzi = numberToSino(10000, { da: true })
    // hanzi = 壹萬
###### option.jishi
真值，21 是写为廿一，还是二十一  
比如：

    const hanzi = numberToSino(320021)
    // hanzi = 卅二万零廿一
    
    const hanzi = numberToSino(320021, { jishi: true })
    // hanzi = 三十二万零二十一

    const hanzi = numberToSino(320020)
    // hanzi = 卅二万零二十
###### option.wanyi
真值，兆表示一万亿还是一亿亿  
比如：

    const hanzi = numberToSino(4e12)
    // hanzi = 四万亿

    const hanzi = numberToSino(4e12, { wanyi: true })
    // hanzi = 四兆

    const hanzi = numberToSino(4e16)
    // hanzi = 四兆
###### option.yi
真值，是否带上“一”  
比如：

    const hanzi = numberToSino(1111)
    // hanzi = 千百十一

    const hanzi = numberToSino(1111, { yi: true })
    // 一千一百一十一
###### option.er
真值，200 和 2000 是写为二百、二千，还是两百、两千  
比如：
    
    const hanzi = numberToSino(22222)
    // hanzi = 两万两千两百廿二

    const hanzi = numbetToSino(22222, { er: true, jishi: true })
    // hanzi = 二万二千二百二十二
###### option.chu
真值，1 到 10 的数字是否写为初几  
比如：
    
    const hanzi = numberToSino(10)
    // hanzi = 十

    const hanzi = numbetToSino(10, { chu: true })
    // hanzi = 初十