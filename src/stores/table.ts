import { defineStore } from 'pinia'

export const useTableStore = defineStore('table', () => {
  const decodeToRows = async (payload: any) => {
    return new Promise((resolve, reject) => {
      const ids: Array<String | Number> = []
      const rows: Array<Array<String | Number>> = []
      for (let i = 0; i < payload.data.length; i++) {
        const row: Array<String | Number> = []
        for (let j = 0; j < payload.columns.length; j++) {
          row.push(payload.data[i][payload.columns[j]])
        }
        ids.push(payload.data[i]['id'])
        rows.push(row)
      }
      resolve({
        data: rows,
        id: ids
      })
    })
  }

  return {
    decodeToRows
  }
})
