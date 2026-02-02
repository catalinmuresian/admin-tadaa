import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import {Cookies} from "quasar";

let api
let IMGS_BASE_URL
let token

export default defineBoot(({ app }) => {
  const dev_headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer FG.-,thVup'y1XkyEH*QWf:E5bjfR#[#QR[,S+}bsq#YlUyL*-Q]Uj(.gd|Z[Xd7"
  }

  api = axios.create(
    {
      baseURL: process.env.NODE_ENV !== 'production' ? 'v2' : "https://api.tadaa.ro/",
      headers: dev_headers
    })

  IMGS_BASE_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://cockpit.tadaa.ro/storage/uploads/'
      : '/imgs'

  token = Cookies.get('token')

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$token = token
})

export { api, IMGS_BASE_URL, token }
