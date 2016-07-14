<script>
  export default {
    types: {
      'string': 'text',
      'boolean': 'checkbox',
      'datetime': 'date',
      'date': 'date',
      'integer': 'integer',
      'choice': 'select',
      'field': 'select',
    },
    apiTypeToVueFormularType (apiType) {
      let types = {
        'string': 'vf-text',
        'boolean': 'vf-checkbox',
        'datetime': 'vf-date',
        'date': 'vf-date',
        'integer': 'vf-number',
        'choice': 'vf-select',
        'field': 'vf-select',
      }
      return types[apiType]
    },
  }
</script>
