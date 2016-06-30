# vue-drf

A Vue.js connector to Django REST Framework (DRF) using vue-resource


## Work in progress / Disclaimer

This package is not yet production ready and my first npm package, so it will probably not work for others out of the
box.


## Usage

install with npm: `npm i -S asmaps/vue-drf`

Install in Vue (e.g. in `main.js`):

```javascript
import VueDrf from 'vue-drf'

Vue.use(VueDrf)
```


## Dependencies

The plugin is written in ES6, so you will need babel to compile. It also uses the `.vue` component notation which is
used as default in the [vue-webpack template](https://github.com/vuejs-templates/webpack).


## Components

### drf-editable-model

Displays a model with editable fields from DRF. Uses an OPTIONS-request to dertermine fields and their properties
(read_only, type, etc). Use a HyperlinkedModelSerializer on the django side, because vue-drf relies on the `url` field.

Non-readonly fields are clickable and change to an appropriate input field (uses vue-formular) to be edited.

The `url` field will automatically be displayed as a link.

#### Example code

JS:
```javascript
export default {
  data () {
    data: {}
  },
  ready () {
    // or use the Resources stuff
    this.$http.get('https://your.drf-api.example.org/model/1/').then((response) => {
      this.data = response.data
    })
  }
}
```

Template:

```html
<drf-editable-model v-if="data" :data="data"></drf-editable-model>
```

Accepts an optional `fields` property which should be a list of field names to display. If not given displays all fields
in order from API. Use to only display a subset or specify the order of your fields.

```html
<drf-editable-model :data="data" :fields="['id', 'created', 'name', 'url']"></drf-editable-model>
```

#### Events

`drf-editable-model` dispatches an event `drf.model-changed` when the model data changed and has been saved to the API.
Contains the new object as payload.
