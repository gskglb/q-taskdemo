// import something here

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  let bus = new Vue()
  Object.defineProperties(Vue.prototype, { $bus: { get: function () {
    return bus
  } } })
}
