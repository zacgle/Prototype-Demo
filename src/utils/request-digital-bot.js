import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_DIGITAL_ROBOT_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000000, // request timeout
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  responseType: 'blob'

})

// request interceptor

export default service
