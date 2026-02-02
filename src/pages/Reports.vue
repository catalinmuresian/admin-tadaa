<template>
  <div class="reports">
    <div class="container">
      <h1>Reports</h1>
      <q-table
        :loading="isLoading"
        :rows="rows"
        :columns="columns"
        :pagination="{rowsPerPage: 50}"
        :filter="filter"
        row-key="_id">
        <template v-slot:top-right>
          <q-btn
            color="primary"
            icon="archive"
            round
            style="margin-right: 30px;"
            no-caps
            @click="exportTable"
          />
          <q-input  dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>

import {computed, onMounted, ref} from "vue";
import {useDataStore} from "stores/data.js";
import {date, exportFile, useQuasar} from "quasar";
const store = useDataStore()
const filter = ref('')
const columns = [
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
    format: val => `${val / 100} lei`,
    sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10),
    sortable: true
  },
  {
    name: 'total_price',
    label: 'Total',
    align: 'left',
    field: 'total_price',
    format: val => `${val / 100} lei`,
    sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10),
    sortable: true
  },
  {
    name: '_created',
    label: 'Date',
    align: 'left',
    field: '_created',
    format: val => date.formatDate(val * 1000, 'DD.MM.YYYY'),
    sortable: true
  },
  {
    name: '_created',
    label: 'Hour',
    align: 'left',
    field: '_created',
    format: val => date.formatDate(val * 1000, 'H:mm'),
    sortable: true
  },
]
const $q = useQuasar()

const rows = computed(() => store.event.reports || [])

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
</script>

<style lang="scss">

</style>
