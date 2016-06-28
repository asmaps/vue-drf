import DrfInlineEditable from './DrfInlineEditable'
import DrfEditableModel from './DrfEditableModel'

export default {
  install (Vue, options) {
    Vue.component('drf-inline-editable', DrfInlineEditable)
    Vue.component('drf-editable-model', DrfEditableModel)
  }
}
