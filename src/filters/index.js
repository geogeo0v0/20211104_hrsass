import moment from 'moment'
export function formatData(value, str = 'YYYY-MM-DD') {
  return moment(value).format(str)
}
