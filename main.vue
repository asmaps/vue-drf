<script>
  import DrfInlineEditable from './src/DrfInlineEditable'
  import DrfEditableModel from './src/DrfEditableModel'
  import DrfModelForm from './src/DrfModelForm'

  export default {
    DrfInlineEditable,
    DrfEditableModel,
    DrfModelForm,
    install (Vue, options) {
      Vue.component('drf-inline-editable', DrfInlineEditable)
      Vue.component('drf-editable-model', DrfEditableModel)
      Vue.component('drf-model-form', DrfModelForm)
    }
  }
</script>
