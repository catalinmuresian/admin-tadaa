<template>
  <div class="reports">
    <div class="container">
      <h1>Reports</h1>
      <q-table
        class="table-cards"
        grid
        hide-pagination
        hide-bottom
        :pagination="{ sortBy: 'label', descending: false }"
        :rows-per-page-options="[0]"
        :rows="rowsTotals"
        :columns="columnsTotals"
        row-key="label"
        binary-state-sort>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card
              :class="{
              'bg-orange-2': props.row.label === 'Total revenue',
              'bg-green-2': props.row.label === 'Total tickets',
              'bg-blue-1': !['Total revenue', 'Total tickets'].includes(props.row.label)
              }">
              <q-card-section>
                <div class="label-card">{{ props.row.label }}</div>
                <div>{{ props.row.label === 'Total revenue' ? `${props.row.value / 100} lei` : props.row.value }}</div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
      <q-table
        :loading="isLoading"
        :rows="rows"
        :columns="columns2"
        :pagination="{rowsPerPage: 50}"
        row-key="day">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn size="sm"
                     color="accent"
                     round dense
                     @click="props.expand = !props.expand"
                     :icon="props.expand ? 'remove' : 'add'" />
            </q-td>
            <q-td
              :props="props"
              key="day"
              class="text-left">
              {{  date.formatDate(props.row?.day * 1000, 'DD.MM.YYYY') }}
            </q-td>
            <q-td
              :props="props"
              key="quantity"
              class="text-left">
              {{  props.row?.quantity }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <q-table
                :loading="isLoading"
                :rows="props.row.list"
                :columns="columns"
                hide-bottom
                hide-no-data
                hide-pagination
                flat
                row-key="_id">
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td auto-width>
                      <q-btn size="sm"
                             color="accent"
                             round dense
                             @click="props.expand = !props.expand; props.expand && handleDetails({ id: props.row.order_id, day: props.row._created })"
                             :icon="props.expand ? 'remove' : 'add'" />
                    </q-td>
                    <q-td
                      :props="props"
                      key="name"
                      class="text-left">
                      {{ props.row?.name}}
                    </q-td>
                    <q-td
                      :props="props"
                      key="category"
                      class="text-left">
                      {{ props.row?.category}}
                    </q-td>
                    <q-td
                      :props="props"
                      key="code"
                      class="text-left">
                      {{ props.row?.code}}
                    </q-td>
                    <q-td
                      :props="props"
                      key="discount_code"
                      class="text-left">
                      {{ props.row?.discount_code}}
                    </q-td>
                    <q-td
                      :props="props"
                      key="subtotal_price"
                      class="text-left">
                      {{  `${props.row?.subtotal_price / 100} lei`}}
                    </q-td>
                    <q-td
                      :props="props"
                      key="total_price"
                      class="text-left">
                      {{  `${props.row?.total_price / 100} lei` }}
                    </q-td>
                    <q-td
                      :props="props"
                      key="_created"
                      class="text-left">
                      {{  date.formatDate(props.row?._created * 1000, 'DD.MM.YYYY') }}
                    </q-td>
                    <q-td
                      :props="props"
                      key="_created"
                      class="text-left">
                      {{ date.formatDate(props.row?._created  * 1000, 'HH:mm') }}
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                      <q-table
                        :loading="isLoading"
                        :rows="props.row.ticket_data || []"
                        :columns="columns3"
                        hide-bottom
                        hide-no-data
                        hide-pagination
                        flat
                        row-key="_id">
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td
                              :props="props"
                              key="domain"
                              class="text-left">
                              {{ props.row?.domain}}
                            </q-td>
                            <q-td
                              :props="props"
                              key="first_name"
                              class="text-left">
                              {{ props.row?.first_name}}
                            </q-td>
                            <q-td
                              :props="props"
                              key="last_name"
                              class="text-left">
                              {{ props.row?.last_name}}
                            </q-td>
                            <q-td
                              :props="props"
                              key="email"
                              class="text-left">
                              {{ props.row?.email}}
                            </q-td>
                            <q-td
                              :props="props"
                              key="phone"
                              class="text-left">
                              {{ props.row?.phone}}
                            </q-td>
                            <q-td
                              :props="props"
                              key="transactionID"
                              class="text-left">
                              {{ props.row?.transactionID}}
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>

import {computed, onMounted, ref, watch} from "vue";
import {useDataStore} from "stores/data.js";
import {date, exportFile, useQuasar} from "quasar";
const store = useDataStore()
const filter = ref('')
const columns = [
  {name: 'details'},
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'category',
    label: 'Category',
    align: 'left',
    field: 'category',
    sortable: true
  },
  {
    name: 'code',
    label: 'Ticket code',
    align: 'left',
    field: 'code',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'discount_code',
    label: 'Discount code',
    align: 'left',
    field: 'discount_code',
    format: val => `${val ?? '-'}`,
    sortable: true
  },
  {
    name: 'subtotal_price',
    label: 'Subtotal',
    align: 'left',
    field: 'subtotal_price',
    sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10),
    sortable: true
  },
  {
    name: 'total_price',
    label: 'Total',
    align: 'left',
    field: 'total_price',
    sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10),
    sortable: true
  },
  {
    name: '_created',
    label: 'Date',
    align: 'left',
    field: '_created',
    sortable: true
  },
  {
    name: '_created',
    label: 'Hour',
    align: 'left',
    field: '_created',
    sortable: true
  },
]
const columns2 = [
  {},
  {
    name: 'day',
    label: 'Day',
    align: 'left',
    field: 'day',
    sortable: true
  },
  {
    name: 'quantity',
    label: 'Quantity',
    align: 'left',
    field: 'quantity',
    sortable: true,
  },
]
const columns3 = [
  {
    name: 'domain',
    label: 'Domain',
    align: 'left',
    field: 'domain',
    sortable: true
  },
  {
    name: 'first_name',
    label: 'First Name',
    align: 'left',
    field: 'first_name',
    sortable: true
  },
  {
    name: 'last_name',
    label: 'First Name',
    align: 'left',
    field: 'last_name',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: 'email',
    sortable: true
  },
  {
    name: 'phone',
    label: 'Phone',
    align: 'left',
    field: 'phone',
    sortable: true
  },
  {
    name: 'transactionID',
    label: 'Transaction ID',
    align: 'left',
    field: 'transactionID',
    sortable: true
  },
]

const columnsTotals = [
  {
    name: 'label',
    field: 'label'
  },
  {
    name: 'value',
    field: 'value',
  }
]
const $q = useQuasar()
const details = ref(false)
const rows = computed(() => store.event.reports?.tickets || [])


const rowsTotals = computed(() => {
  let rows = []
  if (store.event.reports?.totals) {
    const keys = Object.keys(store.event.reports?.totals)
    let labels = {
      total_revenue: 'Total revenue',
      total_tickets: 'Total tickets'
    }

    keys.forEach(k => {
      rows.push(
        {
          label: ['total_tickets', 'total_revenue'].includes(k) ? labels[k] : k,
          value: store.event.reports?.totals?.[k]
        })
    })
  }
  return rows || []
})

const isLoading = computed(() => store.fetchingID === 'reports' && store.isFetching)

function wrapCsvValue (val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

function exportTable () {
  // naive encoding to csv format
  const content = [columns.map(col => wrapCsvValue(col.label))].concat(
    rows.value.map(row => columns.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[ col.field === void 0 ? col.name : col.field ],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'table-export.csv',
    content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}

function handleDetails ({id, day}) {
  store.get_details({id, day})
}

function clearOrderDetails () {
  store.clearOrderDetails()
}

const order = computed(() => store.orderDetails)

watch(() => order.value, (value) => {
  // details.value = !!value
})

</script>

<style lang="scss">
.reports {
  .container {
    .table-cards {
      margin-bottom: 40px;
    }
    .label-card {
      font-weight: 500;
      color: grey;
    }
    .q-table__top {
      .q-table__control {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 20px;
        flex-wrap: nowrap;
        .q-field {
          max-width: 300px;
          width: 100%;
        }
      }
    }
  }
}

</style>
