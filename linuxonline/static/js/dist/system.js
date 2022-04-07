/**
 * System command collections
 * 系统指令集合 用于操作文件等一系列正规操作
 * 并初始化刚开始的文件结构
 */

const originalFilesystem = `
  <d name='/' path='/'>
    <c>
      <d name='docs' path='/docs/'>
          <c>
              <d name='private' path='/docs/private/'>
                  <c>
                      <f name='secret.txt' path='/docs/private/'>
                          <contents>PxNmGkl6M+jDP4AYAKZET18SEnWD5qw5LIP9174lONWslF144K9VHFIk1JA=</contents>
                      </f>
                  </c>
              </d>
              <f name='shoplist.txt' path='/docs/'>
                  <contents>-Applesn-Bananasn-Cookies</contents>
              </f>
              <f name='ok.txt' path='/docs/'>
                  <contents>I am ok.</contents>
              </f>
              <f name='moretodo.txt' path='/docs/'>
                  <contents>A, B, C.</contents>
              </f>
          </c>
      </d>
      <d name='more' path='/more/'>
          <c>
              <f name='moretodo.txt' path='/more/'>
                  <contents>Don't forget this other stuff.</contents>
              </f>
          </c>
      </d>
      <d name='stuff' path='/stuff/'>
          <c>
          </c>
      </d>
      <f name='cool.txt' path='/'>
          <contents>There is a hidden command in this terminal called 'secret'.</contents>
      </f>
      <f name='love.txt' path='/'>
          <contents>我曾经爱过你，现在依然，祝你快乐，阿萌</contents>
      </f>
    </c>
</d>
`

let term = Terminal

const builtInCommands = {}

builtInCommands.cat = {
  about:
    "cat [file]<br><br>&nbsp;&nbsp;Display the contents of the specified file.",
  exe: function (args) {
    if (args.length != 2) {
      return "No such file."
    }
    var result = term.catFile(args[1])
    if (result === false) {
      return "No such file, or argument is a directory name."
    }
    result = (result + "").replace(
      /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
      "$1" + "<br>" + "$2"
    )
    return result
  },
}

/**
 * Change into a directory.
 **/
builtInCommands.cd = {
  about: "cd [path]<br><br>&nbsp;&nbsp;Change directory to the specified path.",
  exe: function (args) {
    if (args.length != 2) return ""
    const result = term.changeDirectory(args[1])
    if (!result) return "No such directory."
    return ""
  },
}

/**
 * Clears the terminal using a special flag on the resetPrompt function.
 **/
builtInCommands.clear = {
  about: "clear<br><br>&nbsp;&nbsp;Clear the terminal window.",
  exe: function () {
    return "" // Functionality is handled internally by watching for this specific command name when resetting the prompt.
  },
}

/**
 * Echos text to the terminal
 **/
builtInCommands.echo = {
  about: "echo [string]<br>&nbsp;&nbsp;Display a line of text.",
  exe: function (args) {
    var result = args.slice()
    result.shift()
    return result.join(" ")
  },
}

/**
 * Encryption commands which use a password a string.
 **/
builtInCommands.encrypt = {
  about:
    "encrypt [message] [password]<br><br>&nbsp;&nbsp;Encrypt a provided message using the password.",
  exe: function (args) {
    if (args.length != 3) {
      return "encrypt: Invalid number of arguments."
    }
    var result = Tea.encrypt(args[1], args[2])
    return result
  },
}
builtInCommands.decrypt = {
  about:
    "decrypt [encoded] [password]<br>&nbsp;&nbsp;Decrypt a provided message using the password.",
  exe: function (args) {
    if (args.length != 3) {
      return "decrypt: Invalid number of arguments."
    }
    var result = Tea.decrypt(args[1], args[2])
    return result
  },
}

/**
 * Lists all available commands or the help for a given command.
 **/
builtInCommands.help = {
  about:
    "help [command]<br><br>&nbsp;&nbsp;Show a list of available commands, or help for a specific command.",
  exe: function (args) {
    var output = ""
    if (args.length == 2 && args[1] && args[1].toLowerCase() in commands) {
      output +=
        "<strong>" +
        args[1].toLowerCase() +
        "</strong>: " +
        commands[args[1].toLowerCase()].about +
        ""
    } else {
      output +=
        "<br>These shell commands are defined internally.Type 'help' to see this list.<br><br>Type 'help name' to find out more about the function 'name'.<br><br>"
      output += ""

      Object.keys(commands)
        .sort()
        .forEach(function (cName) {
          if (!commands[cName].hidden) {
            output += `<span style="color:pink">` + cName + "</span>&nbsp; "
          }
        })
    }
    output += "<br><br>"
    return output
  },
}

/**
 * Lists the recent builtInCommands.
 **/
builtInCommands.history = {
  about:
    "history [-c]<br><br>&nbsp;&nbsp;Display the list of recent commands.<br>&nbsp;&nbsp;-c clear the history list.",
  exe: function (args) {
    if (args.length == 2 && args[1] == "-c") {
      localStorage.setItem("history", [])
      term.history = []
    }
    var history = term.history
    var output = ""

    history.forEach(function (element, index) {
      output += index + "&nbsp;&nbsp;" + element + "<br>"
    })
    return output
  },
}

/**
 * Lists the files and directories in the current path.
 **/
builtInCommands.ls = {
  about:
    "ls [-l]<br><br>&nbsp;&nbsp;List directory contents.<br>&nbsp;&nbsp;-l list contents vertically.",
  exe: function (args) {
    var listing = ""
    var children = Array.prototype.slice.call(
      term.filesystemPointer.querySelector("c").children
    )
    children.forEach(function (element) {
      listing +=
        "<span class='filesystem-" +
        element.nodeName +
        "'>" +
        element.getAttribute("name") +
        "</span>"
      if (args[1] && args[1] == "-l") {
        listing += "<br>"
      } else {
        listing += "&nbsp;&nbsp;&nbsp;&nbsp;"
      }
    })

    return listing
  },
}

/**
 * Print the name of the current/working directory.
 */
builtInCommands.pwd = {
  about: "pwd<br><br>&nbsp;&nbsp;Print the name of the current working directory.",
  exe: function () {
    return term.path
  },
}

/**
 * Reset the local storage data for this app.
 **/
builtInCommands.reboot = {
  about:
    "reboot<br><br>&nbsp;&nbsp;Reboot the terminal and reset saved environment.",
  exe: function () {
    localStorage.removeItem("filesystem")
    localStorage.removeItem("history")
    term.initSession()
    term.bootTerminalStart(document.getElementById("terminal"))
    return ""
  },
}

/**
 * Delete a file with the given name.
 **/
builtInCommands.rm = {
  about:
    "rm [-r][name]<br><br>&nbsp;&nbsp;Delete the file with the specified name in the current directory.",
  exe: function (args) {
    // isDir 为删除文件夹的标记位
    let isDir = false
    if (args.length == 1) {
      return "No filename specified."
    }
    if (args[1] && args[1] == '-r') {
      isDir = true
      args.splice(1, 1)
    }
    const result = term.deleteFile(args[1], isDir)
    if (typeof result === 'string') {
      // 有打印错误信息的则返回
      return result
    }
    return ''
  },
}

/**
 * Create an empty file with the given name.
 **/
builtInCommands.touch = {
  about:
    "touch [name]<br><br>&nbsp;&nbsp;Create a file with the specified name in the current directory.",
  exe: function (args) {
    if (args.length == 1) {
      return "No filename specified."
    }
    if (args.length > 2) {
      return "Too many parameters supplied."
    }
    let result = term.makeFile(args[1])
    if (result !== true) {
      return result
    }
    return ""
  },
}

/**
 * Create an empty directory with the given name.
 **/
builtInCommands.mkdir = {
  about:
    "mkdir [name]<br><br>&nbsp;&nbsp;Create a directory with the specified name in the current directory.",
  exe: function (args) {
    if (args.length == 1) {
      return "No directory name specified."
    }
    if (args.length > 2) {
      return "Too many parameters supplied."
    }
    let result = term.makeFile(args[1], "d")
    if (result !== true) {
      return result
    }
    return ""
  },
}

