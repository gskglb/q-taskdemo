<template>
  <q-layout view="lHr Lpr lFr">
    <q-layout-header>
      <q-toolbar text-color="dark" inverted>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title class="black">
          My Productive App
          <div slot="subtitle">Wisely use your precious time </div>
        </q-toolbar-title>
      </q-toolbar>
      <q-toolbar inverted>
        <q-tabs text-color="dark" style="width:100%" inverted>
          <q-route-tab animated swipable icon="view_list"  to="/list" exact slot="title" />
          <q-route-tab animated swipable icon="add" to="/new" exact slot="title" />
          <q-route-tab animated swipable icon="done_all" to="/done" exact slot="title" />
        </q-tabs>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2white' : null">
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
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  },

  mounted () {
    // Register firebase events
    let tasksRef = this.$db.ref('/user-tasks/' + this.$auth.currentUser.uid + '/')

    tasksRef.on('child_added', (data) => {
      this.$store.dispatch('tasks/taskAdded', data)
    })

    tasksRef.on('child_changed', (data) => {
      this.$store.dispatch('tasks/taskChanged', data)
    })

    tasksRef.on('child_removed', (data) => {
      console.log(data.val())
      this.$store.dispatch('tasks/taskDeleted', data)
    })
  }
}
</script>

<style>
</style>
