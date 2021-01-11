import { get } from "../../../plugin/axios";

export const getAddressBookList = id => get ('/system/staff/addressBookList', id) 