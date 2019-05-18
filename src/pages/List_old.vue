<template>
  <q-page class="bg-white" style="margin-top:0px">
    <NewTask />
    <q-card color='blue-grey-14' flat square style="margin-bottom:3px">
      <q-item-main class="q-px-sm" >
        <q-collapsible label="Filters" dark style="margin-bottom:4px" @show="defaultFilters">
          <div>
            <div class="row no-wrap">
              <q-field class="q-pa-md" dark label="Filter by date">
                <q-datetime dark v-model="filter_start_date_time" type="date" @change="setFilterDate"/>
              </q-field>
              <q-field class="q-pa-md" dark label="Filter by priority">
                <q-select dark v-model="filter_priority" :options="priorityOptions" class="q-mb-md" @input="setFilterPriority" />
              </q-field>
            </div>
            <div class="row justify-end">
              <q-btn dark class="q-mb-sm self-center" icon="clear" flat label="Clear Filters" @click="clearFilters"/>
            </div>
          </div>
        </q-collapsible>
      </q-item-main>
    </q-card>
    <q-card color="blue-grey-14" flat square style="margin:2px" v-for="(record, index) in tasksList" v-bind:key="record.keyRef">
      <q-card-title>
        <div class="q-body-3">
          <q-icon :name="record.start_date_time | dateIcon"></q-icon>
          {{record.title | limitText}}
        </div>
        <p class="q-caption">Start by : {{record.start_date_time  | formatDate}}</p>
        <q-icon v-if="record.completed == true" name="done" />
        <q-btn round flat icon="delete_outline" slot="right" color="white"  @click.native="deleteTask(record.keyRef)">
        </q-btn>
      </q-card-title>
      <q-item-main class="q-px-sm" >
        <q-progress :percentage="record.percentage_completion"  stripe />
        <q-collapsible :icon="record.priority | iconName" :label="record.priority | priorize" dark>
          <div>
            <q-field class="q-mb-md" label="Task" dark>
                <q-input v-model="tasksList[index].title" dark/>
            </q-field>

            <q-field class="q-mb-md" dark label-width=12 label="Chage start date and time" >
              <q-datetime v-model="tasksList[index].start_date_time" type="datetime" dark />
            </q-field>

            <q-field class="q-mb-md" dark label-width=12 icon-color = "black" label="Chage percentage" >
              <div class="row no-wrap">
                <q-slider v-model="tasksList[index].percentage_completion" label snap  :min="0" :max="100" dark/>
              </div>
            </q-field>

            <q-field class="q-mb-md" dark label-width=12>
              <q-toggle v-model="tasksList[index].completed" label="Completed" />
            </q-field>
            <q-btn color="blue-grey-9" @click="updateTask(tasksList[index])"> Update </q-btn>
          </div>
        </q-collapsible>
      </q-item-main>
    </q-card>
  </q-page>
</template>

<style>
  q-card { border-color: coral }
</style>

<script>
import { date } from 'quasar'
import _ from 'underscore'
import NewTask from '../components/newTask'
export default {
  name: 'PageIndex',
  components: { NewTask },
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
    },
    async setFilterDate (val) {
      this.filter_start_date_time = val
    },
    async setFilterPriority (val) {
      this.filter_priority = val
    },
    async clearFilters () {
      this.filter_start_date_time = '-1'
      this.filter_priority = '-1'
    },
    async defaultFilters () {
      this.filter_start_date_time = Date.now()
    }
  },
  watch: {
  },

  data () {
    return {
      filter_start_date_time: '-1',
      filter_priority: '-1',
      filter_selected_priority: 'All',
      priorityOptions: [
        { label: 'All', value: '-1' },
        { label: 'Very High', value: '1' },
        { label: 'High', value: '2' },
        { label: 'Medium', value: '3' },
        { label: 'Low', value: '4' }
      ]

    }
  },

  computed: {
    tasksList: function () {
      let tasksList = this.$store.getters['tasks/tasksList']

      if (this.filter_priority !== '-1') {
        tasksList = _.filter(tasksList, (element) => {
          return element.priority === this.filter_priority
        })
      }
      if (this.filter_start_date_time !== '-1') {
        tasksList = _.filter(tasksList, (element) => {
          return date.formatDate(element.start_date_time, 'DDMMYYYY') === date.formatDate(this.filter_start_date_time, 'DDMMYYYY')
        })
      }
      tasksList = _.sortBy(tasksList, 'priority')
      return tasksList
    },
    completedTasksList: function () {
      return this.$store.getters['tasks/completedTasksList']
    },
    filterDateKey: function () {
      return date.formatDate(this.filter_start_date_time, 'DD-MM-YYYY')
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
      if (input.length < 30) {
        return input
      } else {
        return input.substring(0, 30) + ' ...'
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

  created () {
    this.$bus.$emit('setTitleAndSlogan', { title: 'In-progress Tasks', slogan: '' })
  }

}
</script>
