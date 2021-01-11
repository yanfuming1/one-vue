import {get,post,putData,deleteData} from "../../../plugin/axios";


export const searchQueryList = data=> get ('/administer/reliantFeeRegister/searchQueryList',data)

export const queryYearBasis = data=> get ('/administer/reliantFeeRegister/queryYearBasis',data)

export const certificate = data=> get ('/administer/reliantFeeRegister/certificate',data)