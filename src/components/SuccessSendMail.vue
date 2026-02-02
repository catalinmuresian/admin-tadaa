<template>
  <q-card class="success-send-mail">
    <div>
      <q-img
        :src="$img('email.svg')"
        alt="email"
      />
      <h1>Check your email</h1>
      <span>We emailed a magic link to <strong>{{ user?.email }}</strong><br> Click the link to log in</span>
    </div>
  </q-card>

</template>

<script setup>

const props = defineProps({
  user: Object
})

</script>

<style lang="scss">
.success-send-mail {
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    > .q-img {
      max-width: 140px;
    }
    span {
      text-align: center;
    }
    > h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      line-height: 100%;
      text-align: center;
    }
  }
}

</style>
