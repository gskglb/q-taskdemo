<template>
  <q-page class="bg-light" style="margin-top:0px">
    <q-card color="white" flat square style="margin:2px">
      <q-card-title>
        <q-select class="q-ma-xs"
            stack-label="Filter options"
            color="blue-grey-14"
            separator
            v-model = "filter_option"
            :options="options"
            @input="setFilter"
        />
      </q-card-title>
    </q-card>
    <div v-if="tasksList.length == 0" class="fixed-center">
      <h3>(: Relax :) </h3>
    </div>

    <q-card color="white" text-color="black"  flat square style="margin:5px" v-for="(record) in tasksList" v-bind:key="record.keyRef">
    <q-card-title>
      <div class="q-body-4">
        {{record.title | limitText}}
        <q-icon :name="record.start_date_time | dateIcon">
          <q-tooltip anchor="center right" self="center left" dark>Start time crossed</q-tooltip>
        </q-icon>
        <q-icon v-if="record.completed == true" name="done" />
      </div>
      <q-btn round flat icon="delete_outline" slot="right" color="red"  @click.native="deleteTask(record.keyRef)">
      </q-btn>
    </q-card-title>
    <q-item-main class="q-pa-sm" >
      <p class="q-body-4">{{record.summary}} </p>
      <p class="q-caption">Start by : {{record.start_date_time  | formatDate}} /  ETC : {{record.end_date_time  | formatDate}} </p>
      <p class="q-caption">Completion : {{record.percentage_completion}} %</p>
      <q-progress color="success" :percentage="record.percentage_completion" />
      <br />
      <div class="row justify-center">
        <q-btn-group>
          <q-btn flat no-caps size="sm" label="Edit" class="bg-blue-grey-14" text-color="white" @click.native="editTask = true"/>
          <q-btn flat no-caps size="sm" label="Mark Complete" class="bg-blue-grey-14" text-color="white" @click.native="completeTask(record)"/>
          <q-btn flat no-caps  size="sm" label="Add Notes" class="bg-blue-grey-14" text-color="white" @click.native="showNotes = true"/>
          <q-btn flat no-caps  size="sm" label="Delegate" class="bg-blue-grey-14" text-color="white"/>
        </q-btn-group>
      </div>
      <q-collapsible label="Notes">
        <!-- <q-list>
          <q-item v-for="singleNote in record.notes"  v-bind:key="singleNote.added">
            <q-item-main>
              <q-item-tile label>{{singleNote.text}}</q-item-tile>
              <q-item-tile sublabel>Added on {{singleNote.added | formatDate}} </q-item-tile>
          </q-item-main>
          <q-item-separator />
          </q-item>
        </q-list> -->
        <q-scroll-area style="height: 200px;">
          <q-timeline responsive color="secondary">
            <q-timeline-entry v-for="singleNote in record.notes"  v-bind:key="singleNote.added"
              v-bind:title="singleNote.text"
              v-bind:subtitle="singleNote.added | formatDate"
              side="left"
            >
            </q-timeline-entry>
          </q-timeline>
        </q-scroll-area>
        <!-- <div>
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
        </div> -->
      </q-collapsible>
    </q-item-main>
    <UpdateTask v-bind:taskData="record" v-bind:showNotesModal="editTask" />
    <AddNotesModal v-bind:taskData="record"  v-bind:showNotesModal="showNotes"/>
  </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { date } from 'quasar'
import _ from 'underscore'
import UpdateTask from '../components/updateTask'
import AddNotesModal from '../components/addNotesModal'

export default {
  name: 'PageIndex',
  components: { UpdateTask, AddNotesModal },
  methods: {
    async completeTask (record) {
      record.completed = true
      record.percentage_completion = 100
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
          message: 'Hurray... ',
          color: 'blue-grey-14',
          textColor: 'white',
          icon: 'check'
        })
      }
    },
    async deleteTask (keyRef) {
      this.$q.dialog({
        title: 'Warning',
        message: 'You are about to delete the task.',
        color: 'blue-grey-14',
        ok: true,
        cancel: true,
        preventClose: true,
        noBackdropDismiss: false,
        noEscDismiss: false
      }).then(() => {
        this.$db.ref('/user-tasks/' + this.$auth.currentUser.uid + '/' + keyRef).remove()
      }).catch(() => {
      })
    },
    async setFilterDate (val) {
      this.filter_start_date_time = val
    },
    async setFilter (val) {
      this.filter_option = val
    },
    async clearFilters () {
      this.filter_start_date_time = '-1'
      this.filter_priority = '-1'
    },
    async defaultFilters () {
      this.filter_start_date_time = Date.now()
    },
    async setNotesVisibilityValue (newValue) {
      this.showNotes = false
    },
    async setEdit (newValue) {
      this.editTask = false
    }
  },
  watch: {
  },

  data () {
    return {
      filter_start_date_time: '-1',
      filter_priority: '-1',
      filter_selected_priority: 'All',
      filter_option: '1',
      showNotes: false,
      editTask: false,
      priorityOptions: [
        { label: 'All', value: '-1' },
        { label: 'Very High', value: '1' },
        { label: 'High', value: '2' },
        { label: 'Medium', value: '3' },
        { label: 'Low', value: '4' }
      ],
      options: [
        { label: 'All Open Tasks', value: '-1' },
        { label: 'Urgent and Important - Do it now', value: '1' },
        { label: 'Important but Not urgent - Do it later', value: '2' },
        { label: 'Urgent but not important - Delegate', value: '3' },
        { label: 'Neither urgent not important - Drop', value: '4' }
      ]
    }
  },

  computed: {
    tasksList: function () {
      let tasksList = this.$store.getters['tasks/tasksList']
      console.log('filter option : %o', this.filter_option)
      if (this.filter_option === '1') {
        tasksList = _.filter(tasksList, (element) => {
          return element.urgent === true && element.important === true
        })
      } else if (this.filter_option === '2') {
        tasksList = _.filter(tasksList, (element) => {
          return element.urgent === false && element.important === true
        })
      } else if (this.filter_option === '3') {
        tasksList = _.filter(tasksList, (element) => {
          return element.urgent === true && element.important === false
        })
      } else if (this.filter_option === '4') {
        tasksList = _.filter(tasksList, (element) => {
          return element.urgent === false && element.important === false
        })
      } else if (this.filter_option === '0') {
        tasksList = _.filter(tasksList, (element) => {
          return element.completed === true
        })
      }
      // if (this.filter_start_date_time !== '-1') {
      //   tasksList = _.filter(tasksList, (element) => {
      //     return date.formatDate(element.start_date_time, 'DDMMYYYY') === date.formatDate(this.filter_start_date_time, 'DDMMYYYY')
      //   })
      // }
      tasksList = _.sortBy(tasksList, 'start_date_time')
      return tasksList
    },
    completedTasksList: function () {
      return this.$store.getters['tasks/completedTasksList']
    },
    filterDateKey: function () {
      return date.formatDate(this.filter_start_date_time, 'DD-MM-YYYY')
    },
    sortedNotes: function (notes) {
      return _.sortBy(notes, 'added')
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
      return date.formatDate(dateString, 'DD-MMM-YY : h:mm A')
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
    this.$bus.$on('setNotesVisibility', this.setNotesVisibilityValue)
    this.$bus.$on('setEdit', this.setEdit)
    this.$bus.$emit('setTitleAndSlogan', { title: 'Tasks', slogan: '' })
  }

}
</script>
