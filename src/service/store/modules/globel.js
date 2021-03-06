import api from '@/plugins/api'
import store from '@/plugins/store'
/**
 * Globel STORE
 */
const globel = {
  state: {
    lineData: [],
    stationData: [],
    comData: [],
    carData: []
  },
  mutations: {
    LINE_DATA: (state, lineData) => {
      state.lineData = lineData
    },
    STATION_DATA: (state, stationData) => {
      state.stationData = stationData
    },
    COM_DATA: (state, comData) => {
      state.comData = comData
    },
    CAR_DATA: (state, carData) => {
      state.comData = carData
    }
  },
  actions: {
    getLineList ({ commit }) {
      return new Promise((resolve, reject) => {
        if (store.getters.userId !== '1') {
          api['wholeInformation.getLine']({
            lineId: '',
            lineName: '',
            orgId: store.getters.userId
          }).then(res => {
            let list = []
            res.forEach(item => {
              list.push({
                label: item.lineName,
                value: item.lineUuid
              })
            })
            commit('LINE_DATA', list)
            resolve(list)
          }).catch(error => {
            reject(error)
          })
        } else {
          api['wholeInformation.getLine']({
            lineId: '',
            lineName: '',
            orgId: ''
          }).then(res => {
            let list = []
            res.forEach(item => {
              list.push({
                label: item.lineName,
                value: item.lineUuid
              })
            })
            commit('LINE_DATA', list)
            resolve(list)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    getStationList ({ commit }) {
      return new Promise((resolve, reject) => {
        api['wholeInformation.getStation']().then(res => {
          commit('STATION_DATA', res)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getComList ({ commit }) {
      return new Promise((resolve, reject) => {
        api['wholeInformation.getCompany']({
          orgId: '',
          orgName: ''
        }).then(res => {
          let list = []
          res.forEach(item => {
            list.push({
              label: item.orgName,
              value: item.orgUuid
            })
          })
          commit('COM_DATA', list)
          resolve(list)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCarList ({ commit }) {
      return new Promise((resolve, reject) => {
        if (store.getters.userId === '1') {
          api['wholeInformation.getCar']({
            orgId: '',
            orgName: ''
          }).then(res => {
            let list = []
            res.forEach(item => {
              list.push({
                label: item.busPlateNumber,
                value: item.busUuid
              })
            })
            commit('CAR_DATA', list)
            resolve(list)
          }).catch(error => {
            reject(error)
          })
        } else {
          api['wholeInformation.getCar']({
            orgId: store.getters.userId,
            orgName: ''
          }).then(res => {
            let list = []
            res.forEach(item => {
              list.push({
                label: item.busPlateNumber,
                value: item.busUuid
              })
            })
            commit('CAR_DATA', list)
            resolve(list)
          }).catch(error => {
            reject(error)
          })
        }
      })
    }
  }
}

export default globel
