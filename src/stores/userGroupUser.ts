import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import { useAuthenticationStore } from './authentication'
import { useRouter } from 'vue-router'

const url = import.meta.env.VITE_EVHOME_SUPERADMIN_BASE_URL

type Payload = {
  query?: string | undefined
  path?: string | undefined
  params?: URLSearchParams
}

export const useUserGroupUserStore = defineStore('userGroupUser', () => {
  const authStore = useAuthenticationStore()
  const router = useRouter()

  const getAll = (payload: Payload): Promise<void | AxiosResponse> => {
    return axios
      .get(`${url}/user-group-user?${payload.query}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          token: localStorage.getItem('evhome.superadmin.access_token')
        }
      })
      .catch((error: any) => {
        if (error.response.status === 403) {
          if (error.response.data.message === 'User is not logged in.') {
            authStore
              .logout()
              .then(() => {
                router.push({
                  name: 'Login'
                })
              })
              .catch(() => {
                router.push({
                  name: 'Login'
                })
              })
          } else {
            throw error
          }
        } else {
          throw error
        }
      })
  }

  const get = (payload: Payload): Promise<void | AxiosResponse> => {
    return axios
      .get(`${url}/user-group-user/${payload.path}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          token: localStorage.getItem('evhome.superadmin.access_token')
        }
      })
      .catch((error: any) => {
        if (error.response.status === 403) {
          if (error.response.data.message === 'User is not logged in.') {
            authStore
              .logout()
              .then(() => {
                router.push({
                  name: 'Login'
                })
              })
              .catch(() => {
                router.push({
                  name: 'Login'
                })
              })
          } else {
            throw error
          }
        } else {
          throw error
        }
      })
  }

  const add = (payload: Payload): Promise<void | AxiosResponse> => {
    return axios
      .post(`${url}/user-group-user/`, payload.params, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          token: localStorage.getItem('evhome.superadmin.access_token')
        }
      })
      .catch((error: any) => {
        if (error.response.status === 403) {
          if (error.response.data.message === 'User is not logged in.') {
            authStore
              .logout()
              .then(() => {
                router.push({
                  name: 'Login'
                })
              })
              .catch(() => {
                router.push({
                  name: 'Login'
                })
              })
          } else {
            throw error
          }
        } else {
          throw error
        }
      })
  }
  return { getAll, get, add }
})
