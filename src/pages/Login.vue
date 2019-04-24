<template>
  <q-page padding class="bg-blue-grey-9">
    <q-card color='blue-grey-10' text-color="black" class="fixed-center text-center" style="width: 80%; max-width: 400px;">
      <q-card-main>
        <q-field class="q-mb-md"
          dark
          label-width=12
          icon="email"
          icon-color = "white"
          label="Your Email"
          :error="$v.form.email.$error"
          error-label="We need a valid email"
        >
            <q-input
              dark
              v-model="form.email"
              @blur="$v.form.email.$touch"
              @keyup.enter="submit"
            />
        </q-field>
        <q-field
          dark
          label-width=12
          icon="lock"
          icon-color = "white"
          label="Your Password"
          :error="$v.form.password.$error"
          error-label="Password is not correct"
        >
            <q-input class="q-mb-sm"
              dark
              type="password"
              v-model="form.password"
              @blur="$v.form.password.$touch"
              @keyup.enter="submit"
            />
        </q-field>
      <q-btn color="primary" text-color="black" @click="submit" class="full-width q-mt-md" >
        <span v-if="!loading">Sign In</span>
        <q-spinner-dots v-else/>
      </q-btn>
      </q-card-main>
    </q-card>

  </q-page>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { QSpinnerDots } from 'quasar'

export default {
  components: {
    QSpinnerDots
  },
  data () {
    return {
      form: {
        email: 'guru4raj@gmail.com',
        passwprd: 'test123'
      },
      loading: false
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: { required }
    }
  },
  methods: {
    async submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please provide the required input.')
      } else {
        this.loading = true
        await this.$auth.signInWithEmailAndPassword(this.form.email, this.form.password)
          .then(() => {
            this.$router.push('/list')
            this.loading = false
          }).catch((error) => {
            console.log(error)
            this.$q.notify('Email / password not correct. Please check')
          })
        this.loading = false
      }
    }
  }
}

</script>
<style lang="stylus">
#login
  .mid-bg
    background $primary
    height 50vh
    position fixed
    top 0
    left 0
    width 100%

  .login-card
    padding 50px
    width 40%
    margin 0 auto
    position fixed
    top 50%
    transform translate(-50%, -50%)
    left 50%
    @media (max-width: 400px)
      padding 20px
      width 90%
    @media (max-width: 1000px)
      width 80%
    .login-title
      color rgba(0, 0, 0, .5)
      font-weight bold
      text-align center
      padding-bottom 20px
</style>
