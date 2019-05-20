<template>
   <q-page class="bg-white" style="margin-top:5px">
    <NewTask />
  </q-page>
</template>

<style>

</style>

<script>
import NewTask from '../components/newTask'

export default {
  name: 'PageIndex',
  components: { NewTask },

  methods: {
  },
  watch: {
  },

  data () {
    return {
    }
  },
  created () {
    this.$bus.$emit('setTitleAndSlogan', { title: 'New Task', slogan: '' })
  }

}
</script>
