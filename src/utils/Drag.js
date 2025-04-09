/**
 * @Desc: 鼠标拖动
 */
class Drag {
  /**
   * @Desc: 构造函数
   */
  constructor(downCallback, moveCallback, upCallback) {
    this.isMouseDown = false;
    this.startPos = {
      x: 0,
      y: 0
    }
    this.downCallback = downCallback || function () { }
    this.moveCallback = moveCallback || function () { }
    this.upCallback = upCallback || function () { }
    this.bind()
  }

  /**
   * @Desc: 绑定事件
   */
  bind() {
    this.onMousedown = this.onMousedown.bind(this)
    this.onMousemove = this.onMousemove.bind(this)
    this.onMouseup = this.onMouseup.bind(this)
    this.onTouchstart = this.onTouchstart.bind(this)
    this.onTouchmove = this.onTouchmove.bind(this)
    this.onTouchend = this.onTouchend.bind(this)

    window.addEventListener('mousemove', this.onMousemove)
    window.addEventListener('mouseup', this.onMouseup)
    window.addEventListener('touchmove', this.onTouchmove, { passive: false })
    window.addEventListener('touchend', this.onTouchend)
    window.addEventListener('touchcancel', this.onTouchend)
  }

  /**
   * @Desc: 解绑事件
   */
  off() {
    window.removeEventListener('mousemove', this.onMousemove)
    window.removeEventListener('mouseup', this.onMouseup)
    window.removeEventListener('touchmove', this.onTouchmove)
    window.removeEventListener('touchend', this.onTouchend)
    window.removeEventListener('touchcancel', this.onTouchend)
  }

  /**
   * @Desc: 鼠标按下
   */
  onMousedown(e) {
    e.preventDefault()
    this.isMouseDown = true
    this.startPos.x = e.clientX
    this.startPos.y = e.clientY
    this.downCallback && this.downCallback(e)
  }

  /**
   * @Desc: 触摸开始
   */
  onTouchstart(e) {
    e.preventDefault()
    this.isMouseDown = true
    const touch = e.touches[0]
    this.startPos.x = touch.clientX
    this.startPos.y = touch.clientY
    this.downCallback && this.downCallback(e)
  }

  /**
   * @Desc: 鼠标移动
   */
  onMousemove(e) {
    e.preventDefault()
    if (!this.isMouseDown) {
      return
    }
    let ox = e.clientX - this.startPos.x
    let oy = e.clientY - this.startPos.y
    this.moveCallback && this.moveCallback(ox, oy, e)
  }

  /**
   * @Desc: 触摸移动
   */
  onTouchmove(e) {
    e.preventDefault()
    if (!this.isMouseDown) {
      return
    }
    const touch = e.touches[0]
    let ox = touch.clientX - this.startPos.x
    let oy = touch.clientY - this.startPos.y
    this.moveCallback && this.moveCallback(ox, oy, {
      clientX: touch.clientX,
      clientY: touch.clientY
    })
  }

  /**
   * @Desc: 鼠标松开
   */
  onMouseup(e) {
    this.isMouseDown = false
    this.upCallback && this.upCallback(e)
  }

  /**
   * @Desc: 触摸结束
   */
  onTouchend(e) {
    this.isMouseDown = false
    this.upCallback && this.upCallback(e)
  }
}

export default Drag
