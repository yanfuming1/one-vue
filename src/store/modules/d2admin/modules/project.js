export default {
    namespaced: true,
    state: {
        // 用户 allUser
        ID: [],
        // 五大员
        fiveBigshots: [],
        // 安全员
        safetyOfficer : [],
        // A证
        ACertificate : [],
        // B证
        BCertificate : [],
        // C证
        CCertificate: [],
        // 技术负责人
        technicalDirector: [],
        // 项目经理
        projectManager: [],
        // 标段
        section: [],
        // 工程类别
        proType: [],
        // 资质要求
        qualificationRequirement: [],
        // 投标公司
        BiddingCompany: [],
        // 编制及负责人
        projectComposition: [],
        // 证书名称
        memberCertificate: []
    },
    getters: {
        /**
         * @description 返回现存的项目id
         * @param {*} state vuex state
         */
        getID(state) {
            return state.ID
        },

        /**
         * @description 返回现存的五大员
         * @param {*} state vuex state
         */
        getFiveBigshots(state) {
            return state.fiveBigshots
        },
        /**
         * @description 返回现存的所有职员
         * @param {*} state vuex state
         */
        getSafetyOfficer(state) {
            return state.safetyOfficer
        },
        /**
         * @description 返回现存的 A证
         * @param {*} state vuex state
         */
        getACertificate(state) {
            return state.ACertificate
        },
        /**
         * @description 返回现存的 B证
         * @param {*} state vuex state
         */
        getBCertificate(state) {
            return state.BCertificate
        },
        /**
         * @description 返回现存的 C证
         * @param {*} state vuex state
         */
        getCCertificate(state) {
            return state.CCertificate
        },
        /**
         * @description 返回现存的 技术负责人
         * @param {*} state vuex state
         */
        getTechnicalDirector(state) {
            return state.technicalDirector
        },
        /**
         * @description 返回现存的 项目经理
         * @param {*} state vuex state
         */
        getProjectManager(state) {
            return state.projectManager
        },
        /**
         * @description 返回现存的 标段
         * @param {*} state vuex state
         */
        getSection(state) {
            return state.section
        },
        /**
         * @description 返回现存的 工程类别
         * @param {*} state vuex state
         */
        getProType(state) {
            return state.proType
        },
        /**
         * @description 返回现存的 资质要求
         * @param {*} state vuex state
         */
        getQualityRequirement(state) {
            return state.qualificationRequirement
        },
        // BiddingCompany
        /**
         * @description 返回现存的 投标公司
         * @param {*} state vuex state
         */
        getBiddingCompany(state) {
            return state.BiddingCompany
        },
        // projectComposition
        /**
         * @description 返回现存的 编制及负责人
         * @param {*} state vuex state
         */
        getProjectComposition(state) {
            return state.projectComposition
        },
        // memberCertificate
        /**
         * @description 返回现存的 项目组成人员
         * @param {*} state vuex state
         */
        getMemberCertificate(state) {
            return state.memberCertificate
        },
    },
    mutations: {
        /**
         * @description 设置 项目id
         * @param {Object} state vuex state
         */
        set(state, data) {
            state.ID = data
        },

        /**
         * @description 设置 五大员
         * @param {Object} state vuex state
         */
        setFiveBigshots(state, data) {
            state.fiveBigshots = data
        },

        /**
         * @description 设置 安全员
         * @param {Object} state vuex state
         */
        setSafetyOfficer(state, data) {
            state.safetyOfficer = data
        },
        /**
         * @description 设置 A证
         * @param {Object} state vuex state
         */
        setACertificate(state, data) {
            state.ACertificate = data
        },
        /**
         * @description 设置 B证
         * @param {Object} state vuex state
         */
        setBCertificate(state, data) {
            state.BCertificate = data
        },
        /**
         * @description 设置 C证
         * @param {Object} state vuex state
         */
        setCCertificate(state, data) {
            state.CCertificate = data
        },
        /**
         * @description 设置 技术负责人
         * @param {Object} state vuex state
         */
        setTechnicalDirector(state, data) {
            state.technicalDirector = data
        },
        /**
         * @description 设置 项目经理
         * @param {Object} state vuex state
         */
        setProjectManager(state, data) {
            state.projectManager = data
        },
        /**
         * @description 设置 标段
         * @param {Object} state vuex state
         */
        setSection(state, data) {
            state.section = data
        },
        /**
         * @description 设置 工程类别
         * @param {Object} state vuex state
         */
        setProType(state, data) {
            state.proType = data
        },
        /**
         * @description 设置 资质要求
         * @param {Object} state vuex state
         */
        setQualityRequirement(state, data) {
            state.qualificationRequirement = data
        },
        /**
         * @description 设置 投标公司
         * @param {Object} state vuex state
         */
        setBiddingCompany(state, data) {
            state.BiddingCompany = data
        },
        // projectComposition
        /**
         * @description 设置 编制及负责人
         * @param {Object} state vuex state
         */
        setProjectComposition(state, data) {
            state.projectComposition = data
        },
        // memberCertificate
        /**
         * @description 设置 项目组成人员
         * @param {Object} state vuex state
         */
        setMemberCertificate(state, data) {
            state.memberCertificate = data
        },
    }
}
