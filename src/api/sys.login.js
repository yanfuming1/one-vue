import request from '@/plugin/axios'
import {post, get} from "../plugin/axios";

export const AccountLogin = data => post('/login/login', data)

export const Accountlogout = () => get ('/login/logout')

export const phoneLogin = data => get('/login/phoneLogin', data)