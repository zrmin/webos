/**
 * 工具函数
 */
function getRandomInt(max) {
  /**
   * 获得一个[0, max)的随机整数
   */
  if (typeof max !== "number") throw new TypeError("Number needed!")
  return Math.floor(Math.random() * Math.floor(max))
}

function ajax(params) {
  /**
   * 用于请求天气的ajax函数
   */

  let xhr = new XMLHttpRequest()
  xhr.open(params.type || "get", params.url, params.async)
  xhr.send(params.data || null)
  if (!/^[23]\d{2}$/.test(xhr.status)) {
    return ERROR
  }
  let weather = JSON.parse(xhr.responseText).HeWeather6[0]
  if (weather && weather.status === "ok") {
    const result = weather.now
    const { cond_txt, hum, tmp, wind_spd } = result
    let res = `<p>${cond_txt} humidity:${hum}% temperature:${tmp}℃ wind-speed:${wind_spd}KM/h</p>`
    return res
  } else {
    return ERROR
  }
}

function simplifyPath(path) {
  /**
   * 简化一个以 Unix 风格给出一个文件的绝对路径
   * 例如 "/a/./b/../../c/" => "/c"
   * 思路就是将字符a-z压入栈中
   * 当遇到..则出栈 栈为空时则保持
   * 最后将栈中的字符用'/'连接即可
   * 如果栈为空说明只有根目录
   */
  if (path.length === 0) return ""
  let stack = []
  // 是否为绝对路径
  const list = path.split("/")
  for (let ch of list) {
    if (!["", ".", ".."].includes(ch)) stack.push(ch)
    else if (ch === ".." && stack.length) stack.pop()
  }
  return "/" + stack.join("/")
}

function loopPrint(dom, interval = 250) {
  /**
   * 跳转链接打印的等待字符
   */
  let s = "holding..."
  let i = 0
  const timerId = []
  if (i < s.length) {
    dom.innerText += s.substr(0, i++) + "_"
    let timer = setTimeout(() => loopPrint(dom, interval + 50), interval)
    timerId.push(timer)
  } else {
    // 清空计时器
    timerId.forEach((t) => clearTimeout(t))
    dom.innerText = s
  }
}

