<template>
  <q-page class="bg-blue-grey-14">
    <q-card color='white' flat square text-color="black" class="fixed-center text-center" style="width: 80%; max-width: 400px;">
      <q-card-main>
        <q-field class="q-mb-md" dark
          label-width=12
          icon="email"
          label="Your Email"
          :error="$v.form.email.$error"
          error-label="We need a valid email"
          text-color="blue-grey-14"
        >
            <q-input
              v-model="form.email"
              @blur="$v.form.email.$touch"
              @keyup.enter="submit"
            />
        </q-field>
        <q-field
          dark
          label-width=12
          icon="lock"
          label="Your Password"
          :error="$v.form.password.$error"
          error-label="Password is not correct"
        >
            <q-input class="q-mb-sm"
              type="password"
              v-model="form.password"
              @blur="$v.form.password.$touch"
              @keyup.enter="submit"
            />
        </q-field>
        <q-field
          dark
          label-width=12
          icon="lock"
          label="Confirm Password"
          :error="$v.form.password_again.$error"
          error-label="Passwords do not match"
        >
            <q-input class="q-mb-sm"
              type="password"
              v-model="form.password_again"
              @blur="$v.form.password_again.$touch"
              @keyup.enter="submit"
              ref="password"
            />
        </q-field>

      <q-btn color="blue-grey-14" @click="submit" class="full-width q-mt-md" >
        <span v-if="!loading">Sign Up</span>
        <q-spinner-dots v-else/>
      </q-btn>
      <q-btn color="blue-grey-14"  no-caps outline @click="$router.push('/')" class="full-width q-mt-md" >Sign In</q-btn>
      </q-card-main>
    </q-card>

  </q-page>
</template>

<script>
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { QSpinnerDots } from 'quasar'

export default {
  components: {
    QSpinnerDots
  },
  data () {
    return {
      form: {
        email: '',
        passwprd: ''
      },
      loading: false
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: { required },
      password_again: { sameAsPassword: sameAs('password') }
    }
  },
  methods: {
    async submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please provide the required input.')
      } else {
        this.loading = true
        console.log(this.form.email)
        await this.$auth.createUserWithEmailAndPassword(this.form.email, this.form.password)
          .then(() => {
            this.$router.push('/list')
            this.$q.notify('Account has been created.')
            this.loading = false
          }).catch((error) => {
            console.log(error)
            if (error.code === 'auth/network-request-failed') {
              this.$q.notify(error.message)
            } else {
              this.$q.notify('Email / password not correct. Please check')
            }
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
