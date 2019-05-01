<template>
  <q-page padding class="bg-light" style="margin-top:-15px">
    <q-card color='white' flat square text-color="black" class="q-pa-sm q-mb-sm" v-for="record in completedTasksList" v-bind:key="record.keyRef" dark>
      <q-card-title>
        <div class="q-body-2">
         <q-icon v-if="record.completed == true" name="done" color="positive"/>
          {{record.title}}
        </div>
        <p class="q-caption">Start by : {{record.start_date_time  | formatDate}}</p>
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
    this.$bus.$emit('setTitleAndSlogan', { title: 'Completed Tasks', slogan: 'no tension' })
  }

}
</script>
