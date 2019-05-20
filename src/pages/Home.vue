<template>
  <q-page class="bg-white" style="margin-top:0px">
  <q-fab
    class="fixed"
    style="right: 18px; bottom: 50px"
    color="blue-grey-14"
    direction="up"
    icon="add">
      <q-fab-action
        color="blue-grey-14"
        icon="playlist_add"
        @click.native="addTask"
      />
      <q-fab-action
        color="blue-grey-14"
        icon="group_add"
      />
    </q-fab>
    <q-card color="white" text-color="black" flat square style="margin:2px">
      <q-list highlight>
        <q-list-header>Your Tasks</q-list-header>
        <q-item to="/list">
          <q-item-side>
            <q-item-tile avatar>
               <q-icon name="alarm" size="2rem" />
            </q-item-tile>
          </q-item-side>
          <q-item-main inverted label="Open" />
          <q-item-side right>
            <q-chip color="blue-grey-14" detail>{{openTasksCount}}</q-chip>
          </q-item-side>
        </q-item>
        <q-item to="/done">
          <q-item-side>
            <q-item-tile avatar>
               <q-icon name="check" size="2rem" >
                </q-icon>
            </q-item-tile>
          </q-item-side>
          <q-item-main inverted label="Completed" />
          <q-item-side right>
            <q-chip color="blue-grey-14">{{completedTasksCount}}</q-chip>
          </q-item-side>
        </q-item>
      </q-list>
    </q-card>
    <q-item-separator inset />
    <q-card color="white" text-color="black" flat square style="margin:2px">
      <q-list highlight>
        <q-list-header>Group Tasks</q-list-header>
        <q-item>
          <q-item-side>
            <q-item-tile avatar>
               <q-icon name="group" size="2rem" />
            </q-item-tile>
          </q-item-side>
          <q-item-main inverted label="Group 1" />
          <q-item-side right>
            <q-item-tile icon="arrow_forward_ios" color="black" />
          </q-item-side>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  computed: {
    openTasksCount: function () {
      return this.$store.getters['tasks/tasksList'].length
    },
    completedTasksCount: function () {
      return this.$store.getters['tasks/completedTasksList'].length
    }

  },
  methods: {
    async addTask () {
      this.$router.push('new')
    }
  },
  created () {
    this.$bus.$emit('setTitleAndSlogan', { title: 'Home', slogan: '' })
  }
}
</script>

<style>
</style>
