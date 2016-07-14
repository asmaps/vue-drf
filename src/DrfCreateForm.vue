<template>
  <div>
    <bs-form horizontal v-if="fieldNames" v-ref:form>
      <bs-field
        v-for="name in fieldNames"
        :type="getFieldType(fieldOptions[name].type)"
        :label="fieldOptions[name].label"
        :choices="fieldOptions[name].choices"
        :name="name"
        :errors="errors[name]"
        :form="$refs.form"></bs-field>
      <bs-submit :form="$refs.form"></bs-submit>
    </bs-form>
  </div>
</template>

<script>
  import { BsForm, BsField, BsSubmit } from "vue-bs3-form"
  import utils from "./utils"

  export default {
    props: ['url', 'fields'],
    components: {
      BsForm,
      BsField,
      BsSubmit,
    },
    data () {
      return {
        options: {},
        errors: {},
      }
    },
    computed: {
      fieldOptions () {
        return this.options.actions ? this.options.actions.POST : {}
      },
      fieldNames () {
        function filterCb(el) {
          return this.fieldOptions[el] !== undefined && !this.fieldOptions[el].read_only
        }
        if(this.fields) return this.fields.filter(filterCb.bind(this))
        return Object.keys(this.fieldOptions).filter(filterCb.bind(this))
      },
      validation () {
        let out = {}
        for(let fieldName of this.fieldNames) {
          out[fieldName] = {
            required: this.fieldOptions[fieldName].required || false,
          }
          if(this.fieldOptions[fieldName].min_value || undefined) {
            out[fieldName].min = this.fieldOptions[fieldName].min_value
          }
          if(this.fieldOptions[fieldName].max_value || undefined) {
            out[fieldName].max = this.fieldOptions[fieldName].max_value
          }
        }
        return {rules: out}
      },
    },
    ready () {
      this.fetchOptions()
    },
    methods: {
      getFieldType(type) {
        return utils.types[type]
      },
      fetchOptions () {
        let self = this
        this.$http(this.url, {method: 'OPTIONS'}).then((response) => {
          self.options = response.data
        })
      },
    },
    watch: {
      url () {
        this.fetchOptions()
      }
    },
    events: {
      'bs-form.submit' (data) {
        for(const key of Object.keys(data)) {
          if(this.fieldOptions[key].type == 'boolean') {
            data[key] = data[key] ? true : false
          } else if(this.fieldOptions[key].type == 'integer') {
            if(!data[key]) {
              data[key] = null
            }
          } else {
            if(!data[key]) {
              data[key] = ''
            }
          }
        }
        let self = this
        this.$http.post(this.url, data).then((response) => {
          self.$dispatch('drf.model-created', response.data)
        }, (response) => {
          this.errors = response.data
        })
      },
    },
  }
</script>

<style scoped>
</style>
