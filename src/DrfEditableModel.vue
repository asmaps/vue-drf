<template>
  <div>
    <dl class="dl-horizontal" v-if="fieldNames">
      <template v-for="name in fieldNames">
        <dt>{{ fieldOptions[name].label }}</dt>
        <dd><drf-inline-editable :drfoptions="fieldOptions[name]" :name="name" :value.sync="data[name]"></drf-inline-editable></dd>
      </template>
    </dl>
  </div>
</template>

<script>
  import DrfInlineEditable from './DrfInlineEditable'

  export default {
    props: ['data', 'fields'],
    components: {
      DrfInlineEditable,
    },
    data () {
      return {
        options: {},
      }
    },
    computed: {
      fieldOptions () {
        return this.options.actions ? this.options.actions.PUT : []
      },
      fieldNames () {
        if(this.fields) return this.fields
        return Object.keys(this.fieldOptions)
      }
    },
    ready () {
      this.fetchOptions()
    },
    methods: {
      fetchOptions () {
        let self = this
        this.$http(this.data.url, {method: 'OPTIONS'}).then((response) => {
          self.options = response.data
        })
      },
    },
    watch: {
      data: {
        handler: 'fetchOptions',
        deep: true,
      }
    },
    events: {
      'inline-editable.confirmed' (data) {
        let el = data.el
        let self = this
        this.$http.put(this.data.url, this.data).then((response) => {
          el.$emit('showSaved')
          this.$dispatch('drf.model-changed', response.data)
        }, (response) => {
          el.$emit('showErrors', response.data)
        })
      },
    },
  }
</script>

<style scoped>
  .editable {
    cursor: pointer;
    border-bottom: 1px dotted #777;
  }

  dt {
    width: 200px;
  }

  dd {
    margin-left: 210px;
  }
</style>
