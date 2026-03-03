import {acceptHMRUpdate, defineStore} from 'pinia'
import {api, token} from "boot/axios.js";
import ep from "stores/ep.js";
import {Cookies, Notify} from "quasar";

export const useDataStore = defineStore('data', {
  state: () => ({
    token: null,
    user: {},
    successSendEmail: false,
    isFetching: null,
    fetchingID: null,
    orderDetails: [],
    events: [],
    errorMessageMagicLink: null,
    event: {
      title: '',
      reports: {}
    }
  }),

  getters: {

  },

  actions: {
    clearOrderDetails () {
      this.orderDetails = null
    },
    async get_details ({id, day}) {
      this.fetchingID = 'order_details'
      this.isFetching = true
      try {
        const { data } = await api.post(ep.getDetails, {
          token: token || this.token,
          order: id
        })
        const timestamp = day



        this.event.reports?.tickets.forEach((obj) => {
          if ((obj.day * 1) === timestamp) {
            obj.list.forEach((o) => {
              if (o.order_id === id) {
                o.ticket_data = [data]
              }
            })
          }
        })
      } catch (e) {

      } finally {
        this.isFetching = false
        this.fetchingID = null
      }
    },
    clear_data () {
      this.event = {}
    },

    async change_company ({_id, route}) {
      this.fetchingID = 'change_company'
      this.isFetching = true
      try {
        const { data } = await api.post(ep.changeCompany, {
          token: token || this.token,
          company: _id
        })

        await this.check_token({
          token: token || this.token,
          route
        })

        this.router.push({name: 'dashboard'})
        this.clear_data()

        Notify.create({
          message: 'Compania a fost schimbata cu success',
          type: 'positive',
          position: 'top',
        })
      } catch (e) {
        Notify.create({
          message: 'Eroare schimbare companie',
          type: 'negative',
          position: 'top',
        })

      } finally {
        this.isFetching = false
        this.fetchingID = null
      }
    },

    async get_reports (event, eventTitle) {
      this.fetchingID = 'reports'
      this.isFetching = true
      try {
        const { data } = await api.post(ep.getReports, {
          token: token || this.token,
          event
        })

        this.event.title = eventTitle
        this.event.reports.totals = data.totals
        this.event.reports.tickets = Object.entries(
          data.tickets.reduce((acc, bilet) => {
            const ziua = bilet._created

            if (!acc[ziua]) {
              acc[ziua] = [];
            }

            acc[ziua].push(bilet);

            return acc;
          }, {})
        ).map(([day, list]) => ({day, list, quantity: list.length}))

        this.router.replace({query: {id: event}})
      } catch (e) {

      } finally {
        this.isFetching = false
        this.fetchingID = null
      }
    },

    logout () {
      this.user = {}
      Cookies.remove('token')
      this.router.push({name: 'login'})
    },

    async get_magic_link (email) {
      this.isFetching = true
      this.fetchingID = 'submit_magic_link'
      try {
        const { data } = await api.post(ep.getMagicLink, {
          email
        })
        this.successSendEmail = true
        this.user.email = email

      } catch (e) {
        this.errorMessageMagicLink = e.response.data.error
      } finally {
        this.isFetching = false
        this.fetchingID = null
      }
    },

    async getData () {
      const res = await Promise.allSettled([

      ])

      res.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Promise ${index} failed:`, result.reason);
        }
      });
    },

    async validate_token ({token, route}) {
      try {
        const { data } = await api.post(ep.checkToken, {
          token
        })
        this.events = data?.events
        this.user = data?.user

        if (!Cookies.get('token')) {
          Cookies.set('token', token, {
            expires: 30
          })
        }

        this.token = token

        route.name === 'login'
          ? this.router.push({name: 'dashboard'})
          : this.router.replace({query: {token: undefined, ...route.query}});

        if (route.query.id) {
          let eventTitle
          data?.events.forEach(obj => {
            if (obj._id === route.query.id) {
              eventTitle = obj.title
            }
          })
          if (route.name === 'reports') {
            await this.get_reports(route.query.id, eventTitle)
          }
        }
      } catch (e) {
        Cookies.remove('token')
        route.name !== 'login' && this.router.push({name: 'login'})
      }
    },

    async check_token ({token, route, next}) {
      token
        ? await this.validate_token({token, route})
        : route.name !== 'login' && this.router.push({name: 'login'})
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
