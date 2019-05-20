<template>
  <q-page class="bg-light" style="margin-top:0px">
    <q-card color='white' flat square text-color="black" style="margin:2px" v-for="record in completedTasksList" v-bind:key="record.keyRef" dark>
      <q-card-title>
        <q-chip dense color="blue-grey-14">{{record.start_date_time  | formatDate}}</q-chip> -
        <q-chip dense color="blue-grey-14">{{record.end_date_time   | formatDate}}</q-chip>&nbsp;
        <q-chip dense color="red">{{record.percentage_completion}} %</q-chip>
        <q-btn round flat size="md" icon="delete_outline" color="red"  @click.native="deleteTask(record.keyRef)"></q-btn>

        <div class="q-body-2">
         <q-icon v-if="record.completed == true" name="done" color="positive"/>
          {{record.title}}
        </div>
      </q-card-title>
      <q-item-main class="q-pa-sm" >
        <p class="q-body-4">{{record.summary}} </p>
        <q-collapsible label="Notes">
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
        </q-collapsible>
      </q-item-main>
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
    deleteTask: function (keyRef) {
      console.log(keyRef)
      this.$db.ref('/user-tasks/' + this.$auth.currentUser.uid + '/' + keyRef).remove()
    }
  },

  data () {
    return {
    }
  },

  computed: {
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
    this.$bus.$emit('setTitleAndSlogan', { title: 'Completed Tasks', slogan: '' })
  }

}
</script>
