import config from '../../../../../public/static/config'

export default {
    namespaced: true,
    state: {
        ws: config.ws,
        VUE_APP_IP: config.baseUrl,
        companyName: config.companyName,
        companyDetail: config.companyDetail,
        imgSuffix: config.imgSuffix,
        imgPx: config.imgPx,
        imgEm: config.imgEm,
        showStar: config.showStar
    }
}
  