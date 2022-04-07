/**
 * 用于路径和文件操作相关的 Path class
 */
function Path() {
  this.path = "/"

  /**
   * Determine if the passed value is the proper format for a file name.
   */
  Path.prototype.isValidFilename = function (filename) {
    if (filename == "" || filename == null) {
      return false
    }
    // Remove all but allowed chars.
    let newFilename = filename.replace(/[^A-Za-z\d\.\-_~]/, "")
    // Remove periods if at beginning or end.
    newFilename = newFilename.replace(/^\.|\.$/g, "")
    if (newFilename.length !== filename.length) {
      return false
    }
    // Check for more than 1 period.
    let foundPeriods = newFilename.match(/\./g)
    if (foundPeriods !== null && foundPeriods.length > 1) {
      return false
    }
    return true
  }
  /**
   * Determine if the passed value is the proper format for a directory.
   */
  Path.prototype.isValidDirectory = function (filename) {
    if (filename == "") {
      return false
    }
    // 去掉所有非合法文件名字符的字符
    let newFilename = filename.replace(/[^A-Za-z\d\-_~]/, "")
    if (newFilename.length != filename.length) {
      return false
    }
    return true
  }

  /**
   * Determine if the passed value is the proper format for a directory path (no 		file name at end).
   */
  Path.prototype.isValidDirectoryPath = function (filename) {
    if (filename === "") {
      return false
    }
    // 去掉所有非合法文件名字符的字符
    let newFilename = filename.replace(/[^A-Za-z\d\/\-_~\.+]/, "")

    // 去掉所有非合法文件名字符的字符
    newFilename = newFilename.replace(/(\/)\/+/g, "$1")
    if (newFilename.length !== filename.length) {
      return false
    }
    return true
  }

  /**
   * Parse a path with filename into a selector for finding a file node.
   */
  Path.prototype.parseFilePathToSelector = function (path) {
    // Get the final part (file name).
    const fileName = path.split("\\").pop().split("/").pop()
    // The path without the trailing portion.
    const dirs = path.substring(0, path.lastIndexOf("/") + 1)
    // Create a node selector for a file.
    return "f[name='" + fileName + "'][path='" + dirs + "']"
  }

  /**
   * Parse a path into a selector for finding a directory node.
   */
  Path.prototype.parseDirPathToSelector = function (path) {
    if (path == "/" || path == "~") {
      return "d[name='/'][path='/']"
    }
    // Remove trailing slash.
    path = path.replace(/\/+$/, "")
    // Get the last part - either a file name or a dir name without a trailing slash.
    const name = path.split("\\").pop().split("/").pop()
    // The path without the trailing portion.
    const dirs = path.substring(0, path.lastIndexOf("/") + 1)
    // Create a node selector for a directory.
    return "d[name='" + name + "'][path='" + dirs + name + "/']"
  }
}

let Terminal = (function () {

  const KEY_UP = 38,
    KEY_DOWN = 40,
    KEY_TAB = 9,
    MAX_HISTORY = 20,
    self = {}

  self.pathDesc = new Path()

  // Auxiliary functions
  let resetPrompt = function (terminal, prompt, clearFlag = false) {
    // Node.cloneNode(deep) 方法返回调用该方法的节点的一个副本
    // deep 为深拷贝
    let newPrompt = prompt.parentNode.cloneNode(true)
    // Make sure all other prompts are no longer editable:
    let promptsAll = document.querySelectorAll("[contenteditable=true]")
    for (let i = 0; i < promptsAll.length; i++) {
      promptsAll[i].setAttribute("contenteditable", false)
    }
    // Node 接口的 textContent 属性表示一个节点及其后代的文本内容
    // textContent 与 innerText、innerHTML的区别
    // textContent 会获取所有元素的内容，包括 <script> 和 <style> 元素，然而 innerText 只展示给人看的元素
    // innerText 受 CSS 样式的影响，它会触发回流（ reflow ）去确保是最新的计算样式
    // 使用 textContent 可以防止 XSS 攻击
    if (self.prompt) {
      newPrompt.querySelector(".prompt").textContent = self.prompt
    }
    // 当敲下 clear 或者 reboot 命令时 此标记位为 true
    if (clearFlag) {
      // 不断清除 dom
      while (self.term.firstChild) {
        self.term.removeChild(self.term.firstChild)
      }
    }
    terminal.appendChild(newPrompt)
    newPrompt.querySelector(".prompt").innerHTML = self.customPrompt()
    newPrompt.querySelector(".input").innerHTML = " "
    newPrompt.querySelector(".input").focus()
  }

  let runCommand = function (terminal, cmd, args) {
    terminal.innerHTML += self.commands[cmd].exe(args)
  }

  let updateHistory = function (cmd) {
    if (self.history.length > MAX_HISTORY) {
      self.history.shift()
    }
    self.history.push(cmd)
    localStorage.setItem("history", self.history)
    historyIndex = self.history.length
  }

  let browseHistory = function (prompt, direction) {
    let changedPrompt = false
    if (direction == KEY_UP && historyIndex > 0) {
      prompt.textContent = self.history[--historyIndex]
      changedPrompt = true
    } else if (direction == KEY_DOWN) {
      if (historyIndex < self.history.length) ++historyIndex
      if (historyIndex < self.history.length)
        prompt.textContent = self.history[historyIndex]
      else prompt.textContent = " "
      changedPrompt = true
    }

    if (changedPrompt) {
      // 用于在选择历史命令时 改变光标
      // Range对象代表页面上一段连续的区域，通过Range对象可以获取或者修改页面上任何区域的内容。也可以通过Range的方法进行复制和移动页面任何区域的元素
      let range = document.createRange()
      // 在html5中，每一个浏览器窗口都会有一个selection对象，代表用户鼠标在页面中所选取的区域
      let sel = window.getSelection()
      // setStart(node, offset)
      // 设置起点的位置，node是对startContainer的引用，偏移则是startOffset
      // console.log(prompt.childNodes[0], prompt.textContent.length);
      range.setStart(prompt.childNodes[0], prompt.textContent.length)
      // collapse 起点和结束点在一起时为true
      // Range对象为空（刚createRange()时）也为true
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  let autoCompleteInput = function (input, isCmd) {
    if (input.length === 0) return ""
    const re = new RegExp("^" + input, "ig")
    const suggestions = []
    // 指令的自动补全
    // 获取所有指令
    if (isCmd) {
      let cmds = self.commands
      for (let cmd in cmds) {
        if (cmds.hasOwnProperty(cmd) && cmd.match(re)) {
          suggestions.push(cmd)
        }
      }
      isCmd = false
    } else {
      const curDir = term.filesystemPointer.children[0]
      for (let i = 0; i < curDir.children.length; i++) {
        const fileName = curDir.children[i].getAttribute('name')
        if (fileName.match(re)) {
          suggestions.push(fileName)
        }
      }
    }

    return suggestions
  }

  let saveFilesystem = function () {
    // 用于改变文件之后保存在 Location
    let strFilesystem
    if (typeof XMLSerializer !== "undefined") {
      strFilesystem = new XMLSerializer().serializeToString(self.filesystem)
    } else if ("outerHTML" in self.filesystem) {
      strFilesystem = self.filesystem.outerHTML
    } else {
      strFilesystem = originalFilesystem // Saving doesn't work.
    }
    try {
      localStorage.setItem("filesystem", strFilesystem)
    } catch (e) {
      console.warn('no localStorge here!')
    }
    
  }

  self.bootTerminalStart = function (terminal) {
    // console.log(bootMessageLines);
    const defaultLine = "Type 'help' to get start!"
    if (typeof bootMessageLines === "undefined") {
      bootMessageLines = [defaultLine]
    }
    if (typeof usebootLoader !== "undefined" && !usebootLoader) {
      // 如果设置了 useboot 标志位且为 false 则为默认 boot 信息
      bootMessageLines = [defaultLine]
    }

    let boot = document.getElementById("boot")
    if (boot === null) {
      let bootEle = document.createElement("p")
      bootEle.setAttribute("id", "boot")
      terminal.insertBefore(bootEle, terminal.firstChild)
    }
    boot = document.getElementById("boot")
    self.bootTerminalMessage(terminal, boot, bootMessageLines, 0)
  }

  self.bootTerminalMessage = function (
    terminal,
    bootEle,
    bootMessageLines,
    index
  ) {
    if (index === 0) {
      // 首先隐藏 prompt 并清空默认信息
      terminal.querySelector(".hidden").style.display = "none"
      bootEle.innerHTML = ""
    }
    bootEle.innerHTML += bootMessageLines[index++]
    if (index in bootMessageLines) {
      // 如果 bootMessageLines 还有值
      // 则将其延迟显示
      setTimeout(() => {
        self.bootTerminalMessage(terminal, bootEle, bootMessageLines, index)
      }, 300)
    } else {
      // show the prompt
      terminal.querySelector(".hidden").style.display = ""
      terminal.querySelector(".input").focus()
    }
  }

  self.catFile = function (path, type = "f") {
    /**
     * 输入 path 并根据type(文件或文件夹)返回对应的内容
     * 如果 type = 'f' 则返回文件的 innerHTML
     * 如果 type = 'd' 则返回查找到的 foundNode
     */

    if (!["f", "d"].includes(type)) {
      resetPrompt(term, prompt, false)
      return false
    }

    let foundNode = null,
      selector = "",
      isFile = type === "f"

    const parseToSelector = !isFile
      ? self.pathDesc.parseDirPathToSelector
      : self.pathDesc.parseFilePathToSelector

    if (path.substr(0, 1) !== "/") {
      // 如果不是以根路径为开始
      // 则在当前路径下查找
      selector = parseToSelector(self.path + path)
      foundNode = self.filesystemPointer.querySelector(selector)
    }
    // 如果没找到 foundNode or 以根路径 / 开头 or 找到 Node 不是 type 类型
    // 则进行全局搜索(self.filesystem)
    if (foundNode == null || foundNode.nodeName !== type) {
      // Not found in current directory, search globally:
      selector = parseToSelector(path)
      foundNode = self.filesystem.querySelector(selector)
      if (foundNode == null || foundNode.nodeName !== type) {
        return false
      }
    }
    // We found!
    return isFile ? foundNode.querySelector("contents").innerHTML : foundNode
  }

  /**
   * Create an empty file/dir according to the given type in the current directory with the given name.
   * @TODO - Does not yet support providing a path. Uses current dir.
   * First check if it already exists.
   */
  self.makeFile = function (fileName, type = "f") {
    if (!["d", "f"].includes(type)) {
      resetPrompt(term, prompt, false)
      return false
    }

    const isFile = type === "f"

    const isValid = isFile
      ? self.pathDesc.isValidFilename
      : self.pathDesc.isValidDirectory

    const parseToSelector = !isFile
      ? self.pathDesc.parseDirPathToSelector
      : self.pathDesc.parseFilePathToSelector

    if (!isValid(fileName)) {
      return `${isFile ? "touch" : "mkdir"}: Supplied ${
        isFile ? "file" : "directory"
      } is not valid.`
    }

    const pointer = self.filesystemPointer
    const filePath = self.path + fileName + '/'
    const currentDir = pointer.querySelector("c")

    // 在当前路径下查找是否存在该文件
    selector = parseToSelector(filePath)
    fileFound = pointer.querySelector(selector)
    if (fileFound !== null) {
      return "touch: File already exists."
    }

    // 创建文件或文件夹
    // 节点添加了一个xmlns的命名空间属性 如何去掉呢？
    let file = document.createElement(type)
    file.setAttribute("name", fileName)
    file.setAttribute("path", filePath)
    file.innerHTML = isFile ? "<contents></contents>" : "<c></c>"

    currentDir.appendChild(file)
    saveFilesystem()

    return true
  }

  /**
   * Delete a file or directory in the current directory with the given name.
   * @TODO - Does not yet support providing a path. Uses current dir.
   * First check if it exists.
   */
  self.deleteFile = function (fileName, isDir) {
    // 缓存当前文件指针
    const pointer = term.filesystemPointer 
    // 在当前文件夹下，查看 fileName 是否为文件
    if (!isDir && pointer.nodeName === 'd') {
      return `rm: cannot remove ${fileName}: Is a directory`
    }
    const isValid = isDir
      ? self.pathDesc.isValidDirectory
      : self.pathDesc.isValidFilename

    if (!isValid(fileName)) {
      return "rm: supplied filename is not valid."
    }
    // 顶层父节点判断
    const parent = (ptr) => {
      if (ptr.parentNode.nodeName === '#document') {
        return ptr
      }
      return ptr.parentNode
    }
    // 如果是文件夹 则找到其父节点进行递归删除
    // 否则就在当下节点删除即可
    let currentDir = isDir ? parent(pointer).querySelector("c") : pointer.querySelector("c")
    let fileFound = currentDir.querySelector(`[name="${fileName}"]`)
    if (fileFound === null) {
      return "rm: No such file."
    }
    currentDir.removeChild(fileFound)
    saveFilesystem()
    return true
  }

  self.changeDirectory = function (path) {
    // 可以处理绝对路径和相对路径
    // 之后还涉及对 path 进行简化
    // 例如 '/a/./b/../../c/' => '/c/'
    // 从而可以处理相对路径
    // 对此，先将 path 统一转为绝对路径处理

    // 检验是否为有效的路径
    if (!self.pathDesc.isValidDirectoryPath(path)) return false

    path = path.substr(0, 1) === "/" ? path : self.path + path
    path = simplifyPath(path)
    // Search for the directory.
    const foundNode = self.catFile(path, "d")
    if (foundNode === false) {
      return false
    }

    // We found a node! Update the saved pointer and path.
    self.path = foundNode.getAttribute("path")

    // If there isn't a trailing slash, add one.
    if (self.path.substr(-1) != "/") self.path += "/"
    self.filesystemPointer = foundNode

    return true
  }

  // Terminal functions

  self.initSession = function () {
    self.history = localStorage.getItem("history")
      ? localStorage.getItem("history").split(",")
      : []
    historyIndex = self.history.length
    let fileSystemStr = localStorage.getItem("filesystem")
      ? localStorage.getItem("filesystem")
      : originalFilesystem
    // DOMParser 可以将存储在字符串中的 XML 或 HTML 源代码解析为一个 DOM Document
    self.filesystem = new DOMParser().parseFromString(fileSystemStr, "text/xml")
    // 利用 try catch 來捕獲錯誤情形
    try {
      const errors = self.filesystem.getElementsByTagName("parsererror")
      if (errors.length > 0) {
        throw new Error("Parsing error!")
      }
    } catch (ex) {
      console.error("Parsing error!")
    }

    self.path = "/"
    self.filesystemPointer = self.filesystem.querySelector("d")
  }

  self.init = function (elem, commands, customPrompt) {
    self.initSession()
    // 系统命令集合
    self.commands = commands
    // 自定义命令集合
    self.customPrompt = customPrompt
    // terminal DOM
    self.term = elem
    // 记录 Tab 的按下次数
    self.cnt = 0
    // 历史命令索引
    let historyIndex
    // 当前 prompt dom 对象
    let prompt
    // addEventListener 第三个参数
    // true - 事件句柄在捕获阶段执行
    // false - 默认 事件句柄在冒泡阶段执行
    elem.addEventListener("keydown", function (event) {
      if (event.keyCode == KEY_TAB) {
        // 记录在当前输入内按了几次 KEY_TAB
        self.cnt++
        prompt = event.target

        // 将输入参数变为数组形式
        const input = prompt.textContent.split(" ")

        // 指令自动补全 
        let isCmd = input.length > 1 ? false : true 

        const cur = input.pop()
        const pre = input.join(' ')

        // console.log('pre', pre, 'cur', cur)
        const cmd = autoCompleteInput(cur.replace(/\s+/g, ""), isCmd)

        if (cmd.length == 1) {
          // 如果刚开始输入只有一个字符 就直接补全
          // 如果补全之前还存在字符 则用' '隔开
          prompt.textContent = (pre ? pre + " " : "") + cmd[0]
          var sel = document.getSelection()
          var range = sel.getRangeAt(0)
          var startOffset = prompt.textContent.length
          var node = prompt.childNodes[0]
          range.setStart(node, startOffset)
          // Range.collapse() 方法向边界点折叠该 Range
          // 折叠后的 Range 为空，不包含任何内容
          range.collapse()
          sel.removeAllRanges()
          sel.addRange(range)
        } else {
          if (self.cnt > 1) {
            elem.innerHTML += cmd.join("&nbsp&nbsp")
            resetPrompt(elem, prompt, false)
            self.cnt = 0  
          }        
        }
        // 阻止 tab 的默认切换行为
        event.preventDefault(true)
        return false
      }
    })

    elem.addEventListener("keyup", function (event) {
      if (historyIndex < 0) return
      browseHistory(event.target, event.keyCode)
    })

    elem.addEventListener("keypress", function (event) {
      prompt = event.target
      if (event.keyCode != 13) return false
      const enteredCommand = prompt.textContent.trim()
      // Split entered command by spaces, but not spaces in quotes.
      let input = enteredCommand.match(
        /(?=\S)[^"\s]*(?:"[^\\"]*(?:\\[\s\S][^\\"]*)*"[^"\s]*)*/g
      )

      if (input == null) {
        resetPrompt(elem, prompt, false)
        event.preventDefault()
        return
      }

      // Remove surrounding quotes if any.
      input = input.map(function (e) {
        if (e.charAt(0) === '"' && e.charAt(e.length - 1) === '"') {
          return e.substr(1, e.length - 2)
        } else {
          return e
        }
      })

      // console.log(input);
      if (input[0] && input[0].toLowerCase() in self.commands) {

          runCommand(elem, input[0].toLowerCase(), input)
          // 只向记录中添加有效的命令
          updateHistory(enteredCommand)
      }  else {
          // 直接在 elem.innerHTML 后添加
          // 相当于换行打印
          elem.innerHTML += `${input[0]}: command not found`
        }

      // 携带交互询问的时候 需得到答案后再换新行`resetPrompt`

      // prompt 为 span 标签
      // clear 为标志位 用于是否清空屏幕
      resetPrompt(
        elem,
        prompt,
        ["clear", "reboot"].includes(input[0].toLowerCase())
      )
      event.preventDefault()
    })

    elem.querySelector(".prompt").innerHTML = self.customPrompt()
    elem.querySelector(".input").focus()

    self.bootTerminalStart(elem)
    return self
  }

  return self
})()

