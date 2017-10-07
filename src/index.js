import { remote } from 'electron'
import path from 'path'

export default {
  name: 'electron-link',

  functional: true,

  props: {
    isFile: {
      type: Boolean
    },

    moveToTrash: {
      type: [Boolean, Function]
    }
  },

  render(h, ctx) {
    const { href } = ctx.data.attrs
    const { isFile, moveToTrash, beep } = ctx.props

    const attrs = {
      ...ctx.data,
      on: {
        ...ctx.data.on,
        click(e) {
          e.preventDefault()
          if (isFile) {
            remote.shell.showItemInFolder(href)
          } else if (moveToTrash) {
            const res = remote.shell.moveItemToTrash(path.resolve(href))
            if (typeof moveToTrash === 'function') {
              moveToTrash(res)
            }
          } else {
            remote.shell.openExternal(path.resolve(href))
          }
          if (ctx.data.on && ctx.data.on.click) {
            ctx.data.on.click(e)
          }
        }
      }
    }
    return h('a', attrs, ctx.children)
  }
}
