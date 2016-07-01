var _ = require('underscore')

// should htis go in a view?
module.exports = function (a, options) {
  var archives = _.chain(a)
    .pluck('index.md')
    .groupBy(function (item) {
      if (item && item.date) {
        return moment(item.date).format('YYYY')
      }
    }).value()

  var records = []
  for (var y in archives) {
    archives[y] = _.chain(archives[y])
      .groupBy(function (item) {
        if (item && item.date) {
          return moment(item.date).format('M')
        }
      }).value()
    var newyear = {year: y, months: []}
    var keys = Object.keys(archives[y]).reverse()
    for (m in keys) {
      if (archives[y][keys[m]][0] && archives[y][keys[m]][0].date) {
        newyear.months.push({
          month: moment(archives[y][keys[m]][0].date).format('MMMM'),
          articles: archives[y][keys[m]]
        })
      }
    }
    records.push(newyear)
  }

  var out = ''
  records
    .reverse()
    .filter(function (record) {
      return record.year && record.year != 'undefined'
    })
    .forEach(function (record) {
      out += options.fn(record)
    })
  return out
}
