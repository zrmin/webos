/**
 * Custom command collections
 * 自定义指令集合 用于脑洞大开的操作
 */

let customCommands = {}
const WEATHER_KEY = "40388b6fdde84cc595977044d6bf09b9"
const ERROR = "Error :("

customCommands.hello = {
  about: "hello [name ...]<br>&nbsp;&nbsp;Greet the user with a message.",
  exe: (args) => {
    if (args.length < 2) return "<p>Hello. Why don't you tell me your name?</p>"
    args.shift()
    const name = args.join(" ")
    const randomWelcome = ["Hello ", "Hi~ ", "Nice to see u ", "Welcome "]
    let n = randomWelcome.length
    return randomWelcome[getRandomInt(n)] + name.trim()
  },
}

customCommands.weather = {
  about: "weather [city ...]<br>&nbsp;&nbsp;show the weather info of the city.",
  exe: (args) => {
    if (args.length > 2 || args.length <= 1) {
      return ERROR
    }
    const params = {
      type: "get",
      url: `https://free-api.heweather.net/s6/weather/now?location=${args[1]}&key=${WEATHER_KEY}`,
      async: false,
    }
    try {
      return ajax(params)
    } catch(e) {
      console.error('something wrong with the connection!')
      return ''
    }
    
  },
}

// customCommands.icon = {
//   about: "icon<br>&nbsp;&nbsp;Just show my icon :)",
//   exe: (args) => {
//     if (args.length !== 1) {
//       return `icon command no need other options!`
//     }
//     return `<img src="./favicon.png" style="width:60px;height:60px"/>`
//   },
// }

customCommands.github = {
  about: "github<br>&nbsp;&nbsp;show my github QR Code, pull for scan :)",
  exe: (args) => {
    if (args.length !== 1) {
      return `github command no need other options!`
    }
    return `<img src="https://raw.githubusercontent.com/zrmin/BlogImages/master/images/202204080155512.png" style="width:200px;height:200px;margin-left:5px; border-radius: 50%"/>`
  },
}

customCommands.secret = {
  // Help text for this command.
  about: "secret<br>&nbsp;&nbsp;A command that is not listed in the help.",
  // Whether to hide this command from the help list.
  hidden: true,
  // Executed for this command.
  exe: function () {
    return "The password is: goldfish"
  },
}

customCommands.go = {
  // go to the baidu.com
  about: "goto [..url]<br>&nbsp;&nbsp;just a redirect to the host...",
  exe: function (args) {
    if (args.length === 1 || args.length > 2) {
      return `sorry, proper URL'name is needed...`
    }
    // 一个检验http(s)/ftp(s)的正则
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
     + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
     + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
     + "|" // 允许IP和DOMAIN（域名）
     + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
     + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
     + "[a-z]{2,6})" // first level domain- .com or .museum 
     + "(:[0-9]{1,4})?" // 端口- :80 
     + "((/?)|" // a slash isn't required if there is no file name 
     + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
    var re = new RegExp(strRegex);
    if (!re.test(args[1])) {
      return `pleas input the valid url...`
    }
    const wrapper = function (url) {
      // 默认为 http 前缀
    return ``
    }
    // 打开新窗口并跳转
    window.open(args[1])
    return ""
  },
}

const commands = Object.assign(customCommands, builtInCommands)

