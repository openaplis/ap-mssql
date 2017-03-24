'use strict'

const secrets = require('ap-secrets')
const mssql = require('mssql')

module.exports.runQuery = (queryString, callback) => {
  secrets.mssqlConfig(function (err, config) {
    mssql.connect(config, function(err) {
      var rows = []
      var request = new mssql.Request()
      request.stream = true
      request.query(queryString)

      request.on('row', function(row) {
      	rows.push(row)
      })

      request.on('error', function(err) {
      	callback(err)
      })

      request.on('done', function(affected) {
        callback(null, rows)
      })
    })

    mssql.on('error', function(err) {
        callback(err)
    })
  })
}
