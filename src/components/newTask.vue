<template>
    <q-card color='blue-grey-14' flat square>
    <q-card-main>
        <q-field class="q-mb-md" label-width=12 icon-color = "white" :error="$v.taskData.title.$error" error-label="Please add task">
            <q-input dark v-model="taskData.title" placeholder="What is the task..." class="q-mb-md"  />
        </q-field>
        <q-field class="q-mb-md" label-width=12 icon-color = "white" :error="$v.taskData.summary.$error" error-label="Please add summary of the task">
            <q-input dark type="textarea" v-model="taskData.summary" placeholder="Summary of the task..." class="q-mb-md"  />
        </q-field>
        <q-field class="q-mb-md" label-width=12 icon-color = "white" :error="$v.taskData.start_date_time.$error" error-label="Please add task start date and time">
            <q-datetime dark v-model="taskData.start_date_time" type="datetime" placeholder="By when you want to start..." class="q-mb-md"/>
        </q-field>
        <q-field class="q-mb-md" label-width=12 icon-color = "white">
            <q-datetime dark v-model="taskData.end_date_time" type="datetime" placeholder="By when this task should complete..." class="q-mb-md"/>
        </q-field>
        <q-field class="q-mb-md" label-width=12 icon-color = "white">
          <div class="row no-wrap">
            <q-checkbox dark v-model="taskData.urgent" color="white" label="Urgent" /> &nbsp;
            <q-checkbox dark v-model="taskData.important" color="white" label="Important" />
          </div>
        </q-field>
        <q-btn color="white" text-color="blue-grey-14" @click="addTask" class="full-width q-mt-md" >
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
            type: 'positive'
          })
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
