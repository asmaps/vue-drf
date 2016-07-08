<template>
  <span v-if="drfoptions">
    <span v-if="editing">
      <div v-if="type == 'boolean'">
        <button type="button" @click="setBool(true)" class="btn btn-xs btn-success"><i class="fa fa-check"></i> Ja</button>
        <button type="button" @click="setBool(false)" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> Nein</button>
        <button type="button" @click="cancelEdit" class="btn btn-xs btn-primaty"><i class="fa fa-times"></i> Abbrechen</button>
      </div>
      <div v-else>
        <vf-form client :options="{layout: 'form-inline'}">
          <div :is="fieldType" :items="items" :value.sync="internalValue" :name="name" v-el:input @keyup.esc="cancelEdit"></div>
          <span v-if="saving" class="text-warning" transition="fading"><i class="fa fa-spinner fa-spin"></i></span>
          <span v-else>
            <button type="button" @click="confirmEdit" class="btn btn-xs btn-success"><i class="fa fa-check"></i></button>
            <button type="button" @click="cancelEdit" class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button>
          </span>
        </vf-form>
      </div>
      <ul v-if="errors">
        <li v-for="error in errors" class="text-danger">{{ error }}</li>
      </ul>
    </span>
    <span class="editable" @click="initEdit" v-if="!drfoptions.read_only && !editing">{{ valueDisplay }} <i class="fa fa-pencil"></i></span>
    <span v-if="drfoptions.read_only"><a :href="valueDisplay" v-if="name == 'url'">{{ valueDisplay }}</a><span v-else>{{ valueDisplay }}</span></span>
    <span v-if="saved" class="text-success" transition="fading"><i class="fa fa-check"></i> Gespeichert</span>
  </span>
</template>

<script>
  export default {
    props: ['name', 'value', 'drfoptions'],
    data () {
      return {
        editing: false,
        saved: false,
        saving: false,
        internalValue: '',
        originalValue: '',
        errors: [],
      }
    },
    computed: {
      type () {
        return this.drfoptions.type
      },
      fieldType () {
        let types = {
          'string': 'vf-text',
          'boolean': 'vf-checkbox',
          'datetime': 'vf-date',
          'date': 'vf-date',
          'integer': 'vf-number',
          'choice': 'vf-select',
          'field': 'vf-select',
        }
        return types[this.type]
      },
      items () {
        if(!this.drfoptions.choices) {
          return []
        }
        let items = []
        for(let choice of this.drfoptions.choices) {
          items.push({text: choice.display_name, value: choice.value})
        }
        return items
      },
      valueDisplay () {
        if(this.value === undefined) {
          return '???'
        } else if(this.type == 'boolean') {
          return this.value ? 'ja' : 'nein'
        } else if(this.type == 'date') {
          return moment(this.value).format('ll')
        } else if(this.type == 'datetime') {
          return moment(this.value).format('lll')
        } else if(this.type == 'choice' || (this.type == 'field' && this.drfoptions.choices)) {
          for(let choice of this.drfoptions.choices) {
            if(choice.value == this.value) {
              return choice.display_name
            }
          }
        }
        return this.value
      },
    },
    methods: {
      initEdit () {
        this.internalValue = this.value
        this.originalValue = this.value
        this.errors = []
        this.editing = true
        let self = this
        this.$nextTick(() => {self.$els.input.getElementsByTagName('input')[0].focus()})
      },
      setBool(val) {
        this.internalValue = val
        this.confirmEdit()
      },
      confirmEdit () {
        this.errors = []
        this.saving = true
        this.value = this.internalValue
        this.$dispatch('inline-editable.confirmed', {name: this.name, value: this.internalValue, el: this})
      },
      cancelEdit () {
        this.errors = []
        this.editing = false
        this.value = this.originalValue
      },
    },
    events: {
      'vue-formular.sent' () {
        this.confirmEdit()
      },
      'showSaved' () {
        this.saving = false
        this.saved = true
        this.editing = false
        let self = this
        setTimeout(() => {self.saved = false}, 3000)
      },
      'showErrors' (errors) {
        this.saving = false
        this.errors = []
        for(let key of Object.keys(errors)) {
          this.errors.push(errors[key])
        }
        this.editing = true
      },
    },
  }
</script>

<style scoped>
  .editable {
    cursor: pointer;
    border-bottom: 1px dotted #777;
  }
</style>
