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
