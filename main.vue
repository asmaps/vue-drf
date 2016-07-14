<script>
  import DrfInlineEditable from './src/DrfInlineEditable'
  import DrfEditableModel from './src/DrfEditableModel'
  import DrfCreateForm from './src/DrfCreateForm'

  export default {
    install (Vue, options) {
      Vue.component('drf-inline-editable', DrfInlineEditable)
      Vue.component('drf-editable-model', DrfEditableModel)
      Vue.component('drf-create-form', DrfCreateForm)
    }
  }
</script>
