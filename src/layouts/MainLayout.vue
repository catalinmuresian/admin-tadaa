<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ store.event?.title }}
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round flat>
            <q-avatar size="30px">
              <q-icon name="person" color="white" />
            </q-avatar>
            <q-menu
              v-model="account"
              class="menu-account"
              :offset="[0, 5]">
              <q-card >
                <q-card-section class="user-data">
                  <div>
                    <span class="label">Nume</span>
                    <span class="value">{{ `${store.user?.first_name} ${store.user?.last_name}` }}</span>
                  </div>
                  <div>
                    <span class="label">Email</span>
                    <span class="value">{{ store.user?.email }}</span>
                  </div>
                </q-card-section>
                <q-separator />
                <q-btn
                  no-caps
                  class="full-width"
                  label="Logout"
                  @click="handleLogout()"
                />
              </q-card>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-primary text-white">
      <q-list>
        <q-item-label header>
          {{ store.user.company?.display }}
        </q-item-label>
        <q-list>
          <q-item
            to="/dashboard"
            @click="handleAction('dashboard')"
            active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          <div>
            <q-item-label header
                          class="text-weight-bolder">
              Events
            </q-item-label>
            <q-expansion-item
              v-for="{title, logo, _id} in store.events"
              :key="_id">
              <template v-slot:header>
                <q-item-section avatar class="event-avatar">
                  <q-avatar v-if="logo?.path"
                            :icon="`img:${IMGS_BASE_URL}${logo?.path}`"
                            text-color="white"
                  />
                  <q-avatar v-else
                            icon="event"
                            text-color="white"
                  />
                </q-item-section>

                <q-item-section>
                  {{ title }}
                </q-item-section>
              </template>
              <q-list class="q-pl-lg">
                <q-item to="/reports"
                        @click="handleAction('reports', _id, title)"
                        active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="article" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Reports</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </q-list>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {ref} from "vue";
import {useDataStore} from "stores/data.js";
import {IMGS_BASE_URL} from "boot/axios.js";
import {Cookies} from "quasar";
import {useRoute} from "vue-router";

const store = useDataStore()
const route = useRoute()
const token = route.query?.token || Cookies.get('token')

store.check_token({token, route})
const leftDrawerOpen = ref(false)
const account = ref(false)


function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout () {
  store.logout()
}

function handleAction (action, _id, eventTitle) {
  switch(action) {
    case 'reports':
      store.get_reports(_id, eventTitle)
      break;
    case 'dashboard':
      store.clear_data()
      break;
  }
}
</script>

<style lang="scss">
.q-layout {
  .q-drawer-container {
    .q-drawer {
      .q-expansion-item {
        .event-avatar {
          filter: brightness(10);
        }
      }

      .q-expansion-item__toggle-icon {
        color: $grey;
      }
      .q-drawer__content {
        display: flex;
        flex-direction: column;
      }
      .q-item__section--avatar {
        min-width: unset;
      }
      .q-item__label--header {
        color: $grey;
      }
    }
  }
}
</style>
