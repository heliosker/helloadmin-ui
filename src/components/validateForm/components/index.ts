<<<<<<< HEAD
const path = require('path')

const file = require.context('./', true, /\.vue/)
const components = {}
file.keys().forEach(key => {
    const name = path.basename(key, '.vue')
    components[name] = file(key).default || file(key)
})
=======
import path from 'path';

// const file = require.context('./', true, /\.vue/)
// const modulesFiles = require.context('./modules', true, /\.js$/) // webpack
const files: any = import.meta.globEager("./*.vue") // vite
const components = {}
for (const key in files) {
    // const name = path.basename(key, '.vue')
    // components[name] = files(key).default || files(key)
    components[key.replace(/(\.\/|\.vue)/g, '')] = files[key].default
}
>>>>>>> 448872f46b2724e09b419b5826b6690fe7607cf7

export default components
