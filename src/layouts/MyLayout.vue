<template>
  <q-layout view="lHr Lpr lFr">
    <q-layout-header>
      <q-toolbar color="blue-grey-14" text-color="white">
        <!-- <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn> -->
        <q-toolbar-title class="black">
          {{this.title}}
          <div slot="subtitle">{{this.slogan}}</div>
        </q-toolbar-title>
        <q-btn flat dense round aria-label="Exit">
          <q-tooltip anchor="center right" self="center left" dark>SignOut</q-tooltip>
          <q-icon name="exit_to_app" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>
    <q-layout-footer>
      <q-toolbar color="blue-grey-14" text-color="white">
        <q-tabs color="blue-grey-14" text-color="white" style="width:100%">
          <q-route-tab animated swipable to="/list" exact slot="title" >In Progress</q-route-tab>
          <q-route-tab animated swipable to="/new" exact slot="title">New</q-route-tab>
          <q-route-tab animated swipable to="/done" exact slot="title">Completed</q-route-tab>
        </q-tabs>
      </q-toolbar>
    </q-layout-footer>

    <!-- <q-layout-drawer v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2white' : null">
      <q-list no-border link inset-delimiter>
        <q-list-header>Essential Links</q-list-header>
        <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click.native="openURL('https://github.com/quasarframework/')">
          <q-item-side icon="code" />
          <q-item-main label="GitHub" sublabel="github.com/quasarframework" />
        </q-item>
        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="chat" />
          <q-item-main label="Discord Chat Channel" sublabel="https://discord.gg/5TDhbDg" />
        </q-item>
        <q-item @click.native="openURL('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item @click.native="openURL('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item>
      </q-list>
    </q-layout-drawer>
 -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      title: 'My Productivity App v0.1',
      slogan: 'use your time wisely'
    }
  },
  methods: {
    openURL,
    setTitleAndSlogan: function (payload) {
      this.title = payload.title
      this.slogan = payload.slogan
    }
  },

  created () {
    this.$bus.$on('setTitleAndSlogan', this.setTitleAndSlogan)
  },

  mounted () {
    // Register firebase events
    let tasksRef = this.$db.ref('/user-tasks/' + this.$auth.currentUser.uid + '/')
    var count = 0

    tasksRef.on('child_added', (data) => {
      count++
      this.$store.dispatch('tasks/taskAdded', data)
    })

    tasksRef.on('child_changed', (data) => {
      this.$store.dispatch('tasks/taskChanged', data)
    })

    tasksRef.on('child_removed', (data) => {
      console.log(data.val())
      this.$store.dispatch('tasks/taskDeleted', data)
    })

    tasksRef.once('value', (snap) => {
      console.log('initial data loaded!', snap.numChildren() === count)
    })
  }
}
</script>

<style>
</style>
