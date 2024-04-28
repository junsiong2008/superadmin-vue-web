import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'

const url = import.meta.env.VITE_EVHOME_SUPERADMIN_BASE_URL

type Payload = {
  query?: string
}

export const useUserStore = defineStore('user', () => {
  const getAll = (payload: Payload): Promise<void | AxiosResponse> => {
    return axios
      .get(`${url}/user?${payload.query}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          token: localStorage.getItem('evhome.superadmin.access_token')
        }
      })
      .catch((error: any) => {
        if (error.response.status === 403) {
          if (error.response.data.message === 'User is not logged in.') {
            // TODO: Logout user
            throw error
          }
        } else {
          throw error
        }
      })
  }

  return { getAll }
})
