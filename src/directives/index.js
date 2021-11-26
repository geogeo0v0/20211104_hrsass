// 负责管理所有的自定义指令的文件

// 处理图片加载失败
export const imgerror = {
  // 参数1: el===>指令所在的元素
  // 参数2: binding指令的信息对象,binding.value指令的值
  inserted(el, binding) {
    el.onerror = function () {
      el.src = binding.value
    }
  }
}

export const defaultColor = {
  inserted(el, binding) {
    el.style.color = binding.value
  }
}