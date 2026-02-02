<template>
  <div class="login-page">
    <div class="container flex column items-center justify-center full-height">
      <SuccessSendMail
        v-if="store.successSendEmail"
        :user="store.user"
      />
      <q-card v-else class="full-width">
        <div class="icon-img">
          <q-img
            :src="$img('hyperlink.svg')"
            alt="hyperlink"
          />
        </div>
        <h1>Get your magic link</h1>
        <q-form
          @submit.prevent="handleSubmit"
          @validation-error="(ref) => scrollIfError(ref)"
          class="flex column items-center justify-center"
          greedy>
          <q-input
            class="full-width"
            v-model="email"
            dense
            hide-bottom-space
            type="email"
            lazy-rules="ondemand"
            :rules="[val => !!val || 'Field is required']"
            :error="!!store.errorMessageMagicLink"
            :error-message="store.errorMessageMagicLink"
            label="Email"
            outlined
          />
          <q-btn
            type="submit"
            color="secondary"
            class="full-width"
            no-caps
            :loading="store.fetchingID === 'submit_magic_link' && store.isFetching"
            label="Submit">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-form>
      </q-card>
    </div>
  </div>

</template>

<script setup>
import scrollIfError from '/src/mixins/scrollToErrorField'
import {ref} from "vue";
import {useDataStore} from "stores/data.js";
import {Cookies} from "quasar";
import {useRoute} from "vue-router";
import SuccessSendMail from "components/SuccessSendMail.vue";
const route = useRoute()
const email = ref()

const store = useDataStore()

const token = route.query?.token || Cookies.get('token')

function handleSubmit () {
  store.get_magic_link(email.value)
}

</script>

<style lang="scss">
.login-page {
  height: 100vh;
  background: linear-gradient(135deg, #313646 0%, #252837 50%, #1a1d28 100%);
  .container {
    .q-card {
      max-width: 400px;
      padding: 40px;
      .icon-img {
        background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
        padding: 30px;
        margin: 0 auto 20px;
        max-width: 140px;
        width: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      > h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 20px;
        line-height: 100%;
        text-align: center;
      }
      .q-form {
        gap: 20px;
      }
    }
  }
}
</style>
