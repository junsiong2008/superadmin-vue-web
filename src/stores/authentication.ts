import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const url = import.meta.env.VITE_EVHOME_SUPERADMIN_BASE_URL

export const useAuthenticationStore = defineStore('authentication', () => {
  // states
  const isTokenExist = ref<boolean>(localStorage.getItem('evhome.superadmin.access_token') !== null)

  // watchers
  const isAuthenticated = computed((): boolean => isTokenExist.value)

  // actions
  const hashPassword = async (payload: string): Promise<string> => {
    if (!payload) {
      return ''
    }
    return new Promise((resolve, reject) => {
      const passwordUtf8 = new TextEncoder().encode(payload)
      crypto.subtle
        .digest('SHA-256', passwordUtf8)
        .then((hashBuffer) => {
          const hashArray: Array<number> = Array.from(new Uint8Array(hashBuffer))
          let hashBytes: string = ''
          for (let i = 0; i < hashArray.length; i++) {
            let byte: string = hashArray[i].toString(16)
            if (byte.length < 2) {
              byte = '0' + byte
            }
            hashBytes = hashBytes + byte
          }
          resolve(hashBytes)
        })
        .catch(() => {
          reject()
        })
    })
  }

  const login = (payload: URLSearchParams) => {
    return axios
      .post(`${url}/login`, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        localStorage.setItem('evhome.superadmin.access_token', response.data.data.token)
      })
  }

  const logout = () => {
    return axios
      .get(`${url}/logout`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-encoded',
          token: localStorage.getItem('evhome.superadmin.access_token')
        }
      })
      .then((response) => {
        localStorage.removeItem('evhome.superadmin.access_token')
      })
  }
  return { isAuthenticated, hashPassword, login, logout }
})
