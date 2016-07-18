<template>
  <div>
    <bs-form horizontal v-if="fieldNames" v-ref:form>
      <bs-field
        v-if="!create"
        type="hidden"
        name="id"
        :initial-value="values.id"
        :form="$refs.form"></bs-field>
      <bs-field
        v-for="name in fieldNames"
        :type="getFieldType(fieldOptions[name].type)"
        :label="fieldOptions[name].label"
        :choices="fieldOptions[name].choices"
        :name="name"
        :initial-value="getInitial(name)"
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
    props: {
      url: {
        type: String,
        required: true,
      },
      fields: Array,
      values: Object,
      create: Boolean,
    },
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
        if(this.create) {
          return this.options.actions ? this.options.actions.POST : {}
        } else {
          return this.options.actions ? this.options.actions.PUT : {}
        }
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
      getInitial(name) {
        if(this.fieldOptions[name].choices) {
          for(let choice of this.fieldOptions[name].choices) {
            if(choice.value == this.values[name]) {
              return choice
            }
          }
        }

        return this.values[name] || ''
      },
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
          if(this.fieldOptions[key].read_only) {
            delete data[key]
          } else if(this.fieldOptions[key].type == 'boolean') {
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
        function errorCb(response) {
          this.errors = response.data
        }
        if(this.create){
          this.$http.post(this.url, data).then((response) => {
            self.$dispatch('drf.model-created', response.data)
          }, errorCb)
        } else {
          this.$http.put(this.url, data).then((response) => {
            self.$dispatch('drf.model-changed', response.data)
          }, errorCb)
        }
      },
    },
  }
</script>

<style scoped>
</style>
