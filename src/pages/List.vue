<template>
  <q-page padding class="bg-blue-grey-14">
    <h5 class="text-white">Open Tasks</h5>

    <q-card color='white' text-color="black" class="q-ma-sm" v-for="(record, index) in tasksList" v-bind:key="record.keyRef" dark>
      <q-card-title>
        <q-icon :name="record.start_date_time | dateIcon" color="red"></q-icon>
        {{record.title | limitText}}
        <p>Start by : {{record.start_date_time  | formatDate}}
        </p>

        <q-icon v-if="record.completed == true" name="done" color="positive"/>
        <q-btn round flat icon="delete_outline" slot="right" color="red"  @click.native="deleteTask(record.keyRef)">
        </q-btn>
      </q-card-title>
      <q-item-main class="q-px-sm" >
        <q-progress :percentage="record.percentage_completion" color="positive" stripe />
        <q-collapsible :icon="record.priority | iconName" :label="record.priority | priorize">
          <div>
            <q-field class="q-mb-md"
              dark
              icon-color = "black"
              label="Task"
            >
                <q-input v-model="tasksList[index].title" />

            </q-field>

            <q-field class="q-mb-md"
              dark
              label-width=12
              icon-color = "black"
              label="Chage start date and time"
            >
              <q-datetime v-model="tasksList[index].start_date_time" type="datetime" color="positive" dark />
            </q-field>

            <q-field class="q-mb-md"
              dark
              label-width=12
              icon-color = "black"
              label="Chage percentage"
            >
              <div class="row no-wrap">
                <q-slider v-model="tasksList[index].percentage_completion" label snap color="positive" :min="0" :max="100" dark />
              </div>
            </q-field>

            <q-field class="q-mb-md"
              dark
              label-width=12
              icon-color = "black"
            >
              <q-toggle v-model="tasksList[index].completed" color="secondary" label="Completed" />
            </q-field>
            <q-btn
              color="secondary"
              @click="updateTask(tasksList[index])">
                Update
            </q-btn>
          </div>

        </q-collapsible>
      </q-item-main>
    </q-card>
    <h5 class="text-white">Completed Tasks</h5>
    <q-card color='primary' text-color="black" class="q-ma-sm" v-for="(record) in completedTasksList" v-bind:key="record.keyRef" dark>
      <q-card-title>
        {{record.title | limitText}}
        <q-icon v-if="record.completed == true" name="done" color="positive"/>
        <q-btn round flat icon="delete_outline" slot="right" color="red"  @click.native="deleteTask(record.keyRef)">
        </q-btn>
      </q-card-title>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { date } from 'quasar'
export default {
  name: 'PageIndex',
  methods: {
    async updateTask (record) {
      console.log(record.keyRef)
      if (record.completed === true) {
        record.percentage_completion = 100
      }
      let errorHappened
      await this.$db.ref('/user-tasks/' + this.$auth.currentUser.uid + '/' + record.keyRef).update(record, function (error) {
        errorHappened = error
      })
      if (errorHappened) {
        this.$q.notify({
          message: 'Error occured',
          type: 'negative'
        })
      } else {
        this.$q.notify({
          message: 'Task Updated',
          type: 'positive'
        })
      }
    },
    deleteTask: function (keyRef) {
      console.log(keyRef)
      this.$db.ref('/user-tasks/' + this.$auth.currentUser.uid + '/' + keyRef).remove()
    }
  },
  watch: {
  },

  data () {
    return {
    }
  },

  computed: {
    tasksList: function () {
      let tasksList = this.$store.getters['tasks/tasksList']
      return tasksList
    },
    completedTasksList: function () {
      return this.$store.getters['tasks/completedTasksList']
    }
  },

  filters: {
    priorize: function (value) {
      if (!value) return ''
      let priority = ''
      switch (value) {
        case '1' :
          priority = 'Very High'
          break
        case '2' :
          priority = 'High'
          break
        case '3' :
          priority = 'Medium'
          break
        case '4' :
          priority = 'Low'
          break
        default :
          priority = 'Unknown'
      }
      return priority.charAt(0).toUpperCase() + priority.slice(1)
    },
    iconName: function (value) {
      if (!value) return ''
      let iconName = ''
      switch (value) {
        case '1' :
          iconName = 'grade'
          break
        case '2' :
          iconName = 'priority_high'
          break
        case '3' :
          iconName = 'report_problem'
          break
        case '4' :
          iconName = 'low_priority'
          break
        default :
          iconName = ''
      }
      return iconName
    },

    formatDate: function (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY @ HH:mm aa')
    },

    limitText: function (input) {
      if (input.length < 50) {
        return input
      } else {
        return input.substring(0, 50) + ' ...'
      }
    },

    dateIcon: function (startDateTime) {
      let timeStamp = Date.now()
      let taskDate = new Date(startDateTime)
      let diff = date.getDateDiff(timeStamp, taskDate, 'seconds')
      if (diff > 0) {
        return 'error'
      } else {
        return ''
      }
    }
  },

  mounted () {
  }
}
</script>
