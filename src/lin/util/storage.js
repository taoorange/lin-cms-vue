import storage from 'good-storage'

const LOGIN_KEY = '__login__'

export function setLogined(flag) {
  storage.session.set(LOGIN_KEY, flag)
  return flag
}

export function loadLogined() {
  return storage.session.get(LOGIN_KEY, '')
}

export function cleanLogined() {
  storage.session.remove(LOGIN_KEY)
}

export function setKEY(keyname, val) {
  storage.session.set(keyname, val)
}

export function getKEY(keyname) {
  return storage.session.get(keyname)
}

export function rmKEY(keyname) {
  storage.session.remove(keyname)
}

export function setLKEY(keyname, val) {
  storage.set(keyname, val)
}

export function getLKEY(keyname) {
  return storage.get(keyname)
}

export function rmLKEY(keyname) {
  storage.remove(keyname)
}




