/**
 * @Desc: 尺寸拖动调整类
 */
class Resize {
  /**
   * javascript comment
   * @Author: 王林25
   * @Date: 2021-04-29 15:50:41
   * @Desc: 构造函数
   */
  constructor() {
    // 拖动方向
    this._dir = ''
    // 属性
    this._prop = ''
    // 容器的宽度/高度
    this._containerSize = 0
    // 编辑器列表
    this._dragItemList = []
    // 鼠标上一次的位置
    this._last = 0
    // 缓存
    this._minSizeCache = {}
    this._maxSizeCache = {}
    // 收起前的尺寸缓存
    this._collapsedSizeCache = {}

    this.init = this.init.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.collapseItem = this.collapseItem.bind(this)
    this.expandItem = this.expandItem.bind(this)
  }

  /**
   * @Desc: 初始化
   */
  init({
    dir, // 拖动方向：v（垂直）、h（水平）
    dragItemList, // 拖动列表，ref数组，[{width,height,...}]
    containerSize // 容器的宽度或高度
  }) {
    this._dir = dir
    this._dragItemList = dragItemList
    this._containerSize = containerSize
    this._prop = this._dir === 'v' ? 'height' : 'width'
  }

  /**
   * @Desc: 获取某个区域允许的最小尺寸
   */
  getMinSize(index) {
    if (this._minSizeCache[index] !== undefined) {
      return this._minSizeCache[index]
    }
    return (this._minSizeCache[index] =
      ((this._dragItemList.value[index].min
        ? this._dragItemList.value[index].min
        : 0) /
        this._containerSize) *
      100)
  }

  /**
   * @Desc: 获取某个区域允许的最大尺寸
   */
  getMaxSize(index) {
    if (this._maxSizeCache[index] !== undefined) {
      return this._maxSizeCache[index]
    }
    let minSum = this._dragItemList.value.reduce((sum, cur, i) => {
      return (sum += index === i ? 0 : cur.min || 0)
    }, 0)
    return (this._maxSizeCache[index] =
      ((this._dragItemList.value[index].max
        ? this._dragItemList.value[index].max
        : this._containerSize - minSum) /
        this._containerSize) *
      100)
  }

  /**
   * @Desc: 获取第一个可以调整的元素索引
   */
  getFirstNarrowItemIndex(dir, index) {
    if (dir === 'leftUp') {
      let narrowItemIndex = index - 1
      while (narrowItemIndex >= 0) {
        let _minSize = this.getMinSize(narrowItemIndex)
        if (this._dragItemList.value[narrowItemIndex][this._prop] > _minSize) {
          break
        }
        narrowItemIndex--
      }
      return narrowItemIndex
    } else if (dir === 'rightDown') {
      let narrowItemIndex = index
      while (narrowItemIndex <= this._dragItemList.value.length - 1) {
        let _minSize = this.getMinSize(narrowItemIndex)
        if (this._dragItemList.value[narrowItemIndex][this._prop] > _minSize) {
          break
        }
        narrowItemIndex++
      }
      return narrowItemIndex
    }
  }

  /**
   * @Desc: 判断是否允许拖动
   */
  isCanDrag(dir, index) {
    // 自身的区域是否还允许调整
    // if (dir === 'leftUp') {
    //     if (this._dragItemList.value[index][this._prop] >= this.getMaxSize(index)) {
    //         return false
    //     }
    // } else if (dir === 'rightDown') {
    //     if (this._dragItemList.value[index][this._prop] <= this.getMinSize(index)) {
    //         return false
    //     }
    // }
    // 其他部分已经没有可压缩的空间
    let narrowItemIndex = this.getFirstNarrowItemIndex(dir, index)
    if (
      narrowItemIndex < 0 ||
      narrowItemIndex > this._dragItemList.value.length - 1
    ) {
      return false
    }
    return true
  }

  /**
   * @Desc: 拖动开始
   */
  onDragStart(e) {
    this._last = this._dir === 'v' ? e.clientY : e.clientX
  }

  /**
   * @Desc: 拖动
   */
  onDrag(index, ox, oy, e) {
    let client = this._dir === 'v' ? e.clientY : e.clientX
    // 本次移动的距离
    let dx = client - this._last
    // 换算成百分比
    let rx = (dx / this._containerSize) * 100
    // 更新上一次的鼠标位置
    this._last = client
    if (dx < 0) {
      // 向左/上拖动
      if (!this.isCanDrag('leftUp', index)) {
        return
      }
      // 拖动中的编辑器增加宽度
      if (
        this._dragItemList.value[index][this._prop] - rx <
        this.getMaxSize(index)
      ) {
        this._dragItemList.value[index][this._prop] -= rx
      } else {
        this._dragItemList.value[index][this._prop] = this.getMaxSize(index)
      }
      // 找到左边第一个还有空间的编辑器索引
      let narrowItemIndex = this.getFirstNarrowItemIndex('leftUp', index)
      let _minSize = this.getMinSize(narrowItemIndex)
      // 左边的编辑器要同比减少宽度
      if (narrowItemIndex >= 0) {
        // 加上本次偏移还大于最小宽度
        if (
          this._dragItemList.value[narrowItemIndex][this._prop] + rx >
          _minSize
        ) {
          this._dragItemList.value[narrowItemIndex][this._prop] += rx
        } else {
          // 否则固定为最小宽度
          this._dragItemList.value[narrowItemIndex][this._prop] = _minSize
        }
      }
    } else if (dx > 0) {
      // 向右/下拖动
      if (!this.isCanDrag('rightDown', index)) {
        return
      }
      // 找到拖动中的编辑器及其右边的编辑器中的第一个还有空间的编辑器索引
      let narrowItemIndex = this.getFirstNarrowItemIndex('rightDown', index)
      let _minSize = this.getMinSize(narrowItemIndex)
      if (narrowItemIndex <= this._dragItemList.value.length - 1) {
        let ax = 0
        // 减去本次偏移还大于最小宽度
        if (
          this._dragItemList.value[narrowItemIndex][this._prop] - rx >
          _minSize
        ) {
          ax = rx
        } else {
          // 否则本次能移动的距离为到达最小宽度的距离
          ax = this._dragItemList.value[narrowItemIndex][this._prop] - _minSize
        }
        // 更新拖动中的编辑器的宽度
        this._dragItemList.value[narrowItemIndex][this._prop] -= ax
        // 左边第一个编辑器要同比增加宽度
        if (index > 0) {
          if (
            this._dragItemList.value[index - 1][this._prop] + ax <
            this.getMaxSize(index - 1)
          ) {
            this._dragItemList.value[index - 1][this._prop] += ax
          } else {
            this._dragItemList.value[index - 1][this._prop] = this.getMaxSize(
              index - 1
            )
          }
        }
      }
    }
  }

  /**
   * @Desc: 收起某个区域
   */
  collapseItem(index, touchBarSize, containerSize) {
    // 如果已经收起，则不处理
    if (this._collapsedSizeCache[index] !== undefined) {
      return false
    }
    
    // 保存当前尺寸到缓存
    this._collapsedSizeCache[index] = this._dragItemList.value[index][this._prop]
    
    // 计算收起后的尺寸（只保留touchBar的尺寸）
    const collapsedSize = (touchBarSize / containerSize) * 100
    
    // 需要释放的空间
    const releaseSize = this._dragItemList.value[index][this._prop] - collapsedSize
    
    // 找到可以扩展的相邻项
    let expandIndex = -1
    
    if (this._dir === 'v') {
      // 垂直方向，优先考虑上方项
      if (index > 0 && this._collapsedSizeCache[index - 1] === undefined) {
        expandIndex = index - 1
      } else if (index < this._dragItemList.value.length - 1 && this._collapsedSizeCache[index + 1] === undefined) {
        expandIndex = index + 1
      }
    } else {
      // 水平方向，优先考虑左侧项
      if (index > 0 && this._collapsedSizeCache[index - 1] === undefined) {
        expandIndex = index - 1
      } else if (index < this._dragItemList.value.length - 1 && this._collapsedSizeCache[index + 1] === undefined) {
        expandIndex = index + 1
      }
    }
    
    // 如果找到可扩展的项，则分配空间
    if (expandIndex !== -1) {
      this._dragItemList.value[expandIndex][this._prop] += releaseSize
      this._dragItemList.value[index][this._prop] = collapsedSize
      return true
    }
    
    // 如果没有找到可扩展的相邻项，则取消操作
    delete this._collapsedSizeCache[index]
    return false
  }

  /**
   * @Desc: 展开某个区域
   */
  expandItem(index) {
    // 如果没有收起，则不处理
    if (this._collapsedSizeCache[index] === undefined) {
      return false
    }
    
    // 获取收起前的尺寸
    const originalSize = this._collapsedSizeCache[index]
    
    // 当前尺寸
    const currentSize = this._dragItemList.value[index][this._prop]
    
    // 需要恢复的空间
    const recoverSize = originalSize - currentSize
    
    // 找到需要缩小的相邻项
    let narrowIndex = -1
    
    if (this._dir === 'v') {
      // 垂直方向，优先考虑上方项
      if (index > 0 && this._collapsedSizeCache[index - 1] === undefined) {
        narrowIndex = index - 1
      } else if (index < this._dragItemList.value.length - 1 && this._collapsedSizeCache[index + 1] === undefined) {
        narrowIndex = index + 1
      }
    } else {
      // 水平方向，优先考虑左侧项
      if (index > 0 && this._collapsedSizeCache[index - 1] === undefined) {
        narrowIndex = index - 1
      } else if (index < this._dragItemList.value.length - 1 && this._collapsedSizeCache[index + 1] === undefined) {
        narrowIndex = index + 1
      }
    }
    
    // 如果找到可缩小的项，检查是否有足够空间
    if (narrowIndex !== -1) {
      const minSize = this.getMinSize(narrowIndex)
      const currentPanelSize = this._dragItemList.value[narrowIndex][this._prop]
      const availableSpace = currentPanelSize - minSize
      
      // 如果可用空间不足，则无法展开
      if (availableSpace < recoverSize) {
        return false
      }
      
      // 恢复空间
      this._dragItemList.value[narrowIndex][this._prop] -= recoverSize
      this._dragItemList.value[index][this._prop] = originalSize
      
      // 清除缓存
      delete this._collapsedSizeCache[index]
      return true
    }
    
    return false
  }
}

export default Resize
