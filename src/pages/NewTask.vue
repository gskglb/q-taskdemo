<template>
  <q-page padding class="bg-blue-grey-9">
    <q-card color='blue-grey-10' dark>
    <q-card-title>
        New Task
    </q-card-title>
    <q-card-main>
        <q-field class="q-mb-md"
          dark
          label-width=12
          icon-color = "white"
          :error="$v.taskData.title.$error"
          error-label="Please add task"
        >
            <q-input v-model="taskData.title" placeholder="Add your task..." class="q-mb-md" dark />
        </q-field>
        <q-field class="q-mb-md"
          dark
          label-width=12
          icon-color = "white"
          :error="$v.taskData.start_date_time.$error"
          error-label="Please add date and time"
        >
            <q-datetime v-model="taskData.start_date_time" type="datetime" placeholder="Set date and time..." class="q-mb-md" dark />
        </q-field>
        <q-field class="q-mb-md"
          label-width=12
          icon-color = "white"
          :error="$v.taskData.priority.$error"
          error-label="Please set the priority"
        >
            <q-select
                v-model="taskData.priority"
                radio
                :options="priorityOptions"
                placeholder="Choose the priority..."
                class="q-mb-md"
                dark />
        </q-field>

    <q-btn color="primary" text-color="black" @click="addTask" class="full-width q-mt-md" >
        <span v-if="!loading">Add Task</span>
        <q-spinner-dots v-else/>
    </q-btn>
    </q-card-main>
    </q-card>
  </q-page>
</template>

<style>

</style>

<script>
import { required } from 'vuelidate/lib/validators'
import { QSpinnerDots } from 'quasar'

export default {
  name: 'PageIndex',
  components: {
    QSpinnerDots
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
          this.taskData.title = ''
          this.taskData.priority = ''
          this.taskData.start_date_time = null
          this.$v.$reset()
          this.$q.notify({
            message: 'Task added',
            type: 'positive'
          })
        }
      }
      this.loading = false
    }
  },
  watch: {
  },

  data () {
    return {
      taskData: {
        title: '',
        start_date_time: null,
        priority: '',
        completed: false,
        percentage_completion: 0,
        keyRef: ''
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
  validations: {
    taskData: {
      title: { required },
      start_date_time: { required },
      priority: { required }
    }
  }
}
</script>
