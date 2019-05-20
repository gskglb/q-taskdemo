<template>
  <q-card flat square style="margin:2px">
  <q-card-main>
      <q-field class="q-mb-xs" label="Task" label-width=12 text-color="black" :error="$v.taskData.title.$error" error-label="Please add task">
          <q-input  v-model="taskData.title" class="q-mb-xs"  />
      </q-field>
      <q-field class="q-mb-xs" label="Summary" label-width=12  :error="$v.taskData.summary.$error" error-label="Please add summary of the task">
          <q-input  type="textarea" v-model="taskData.summary" class="q-mb-xs"  />
      </q-field>
      <q-field class="q-mb-xs" label="Expected time to start" label-width=12  :error="$v.taskData.start_date_time.$error" error-label="Please add task start date and time">
          <q-datetime  v-model="taskData.start_date_time" type="datetime" class="q-mb-xs"/>
      </q-field>
      <q-field class="q-mb-xs" label="Expected time to complete (Optional)" label-width=12 >
          <q-datetime  v-model="taskData.end_date_time" type="datetime" class="q-mb-xs"/>
      </q-field>
      <q-field class="q-mb-xs" label="Ugent / Important ?" label-width=12>
        <div class="row no-wrap">
          <q-checkbox  v-model="taskData.urgent" label="Urgent" /> &nbsp;&nbsp;&nbsp;
          <q-checkbox  v-model="taskData.important" label="Important" />
        </div>
      </q-field>
      <q-btn color="blue-grey-14" @click="addTask" class="full-width q-mt-md" >
          <span v-if="!loading">Add Task</span>
          <q-spinner-dots v-else/>
      </q-btn>
  </q-card-main>
  </q-card>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { QSpinnerDots } from 'quasar'

export default {
  name: 'NewTask',
  components: {
    QSpinnerDots
  },
  data () {
    return {
      taskData: {
        keyRef: '',
        title: '',
        summary: '',
        important: false,
        urgent: false,
        start_date_time: null,
        end_date_time: null,
        priority: '',
        completed: false,
        percentage_completion: 0,
        dependent: '',
        dependency_notes: null,
        delegated: false,
        delegatedTo: '',
        delegatedOn: null,
        notes: []
      },
      loading: false,
      priorityOptions: [
        { label: 'Very High', value: '1' },
        { label: 'High', value: '2' },
        { label: 'Medium', value: '3' },
        { label: 'Low', value: '4' }
      ]
    }
  },
  methods: {
    async addTask () {
      this.loading = true
      this.$v.taskData.$touch()
      if (this.$v.taskData.$error) {
        this.$q.notify('Please provide the required input.')
      } else {
        let errorInUpdate
        let keyRef = await this.$db.ref('/user-tasks/' + this.$auth.currentUser.uid + '/').push()
        console.log(keyRef)
        this.taskData.keyRef = keyRef.key
        await keyRef.set(this.taskData, function (error) {
          errorInUpdate = error
        })
        if (errorInUpdate != null) {
          this.$q.notify({
            message: 'Error occured',
            type: 'negative'
          })
        } else {
          this.resetAll()
          this.$v.$reset()
          this.$q.notify({
            message: 'Task added',
            color: 'blue-grey-14',
            textColor: 'white'
          })
          this.$router.push('list')
        }
      }
      this.loading = false
    },

    async resetAll () {
      this.taskData.title = ''
      this.taskData.summary = ''
      this.taskData.start_date_time = null
      this.taskData.end_date_time = null
      this.taskData.urgent = false
      this.taskData.important = false
    }
  },
  validations: {
    taskData: {
      title: { required },
      summary: { required },
      important: { required },
      urgent: { required },
      start_date_time: { required }
    }
  }
}
</script>

<style>
</style>
