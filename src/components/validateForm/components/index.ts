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

export default components
