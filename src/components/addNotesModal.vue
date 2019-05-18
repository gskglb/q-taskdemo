<template>
  <q-modal v-model="showModal" minimized ref="modalRef">
    <div style="padding: 10px">
        <q-field class="q-mb-md" label="Notes">
            <q-input type="textarea" v-model="notesText"/>
        </q-field>
      <q-btn class="bg-blue-grey-14" text-color="white" size="sm" @click.native="addNotes" label="Add Note" />
    </div>
  </q-modal>
</template>

<script>
export default {
  name: 'AddNotesModal',
  props: {
    taskData: Object,
    showNotesModal: Boolean
  },
  data () {
    return {
      notesText: ''
    }
  },
  computed: {
    showModal: {
      get: function () {
        return this.showNotesModal === true
      },
      set: function (newValue) {
        this.$bus.$emit('setNotesVisibility', { newValue })
      }
    }
  },
  methods: {
    async addNotes () {
      if (this.taskData.notes == null) {
        this.taskData.notes = []
      }
      this.taskData.notes.push({ 'text': this.notesText, 'added': new Date() })
      let errorHappened
      await this.$db.ref('/user-tasks/' + this.$auth.currentUser.uid + '/' + this.taskData.keyRef).update(this.taskData, function (error) {
        errorHappened = error
      })
      if (errorHappened) {
        this.$q.notify({
          message: 'Error occured',
          type: 'negative'
        })
      } else {
        this.$q.notify({
          message: 'Notes Updated',
          color: 'blue-grey-14',
          textColor: 'white',
          icon: 'check'
        })
      }
      this.showModal = false
      this.notesText = ''
    }
  }
}
</script>

<style>
</style>
