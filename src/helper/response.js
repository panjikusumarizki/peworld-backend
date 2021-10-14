const response = {
  success: (res, data, message) => {
      const result = {
          success: true,
          code: 200,
          status: 'OK',
          message: message,
          data: data
      }
      res.json(result);
  },

  failed: (res, data, message) => {
    const result = {
        success: false,
        code: 404,
        status: 'FALSE',
        message: message,
        data: data
    }
    res.json(result);
},

    errorServer: (res, data, message) => {
      const result = {
          success: false,
          code: 500,
          status: 'ERROR',
          message: message,
          data: data
      }
      res.status(500).json(result);
  },
  dataTable: (res, data, tableRow, message) => {
    const result = {
        message,
        code: 200,
        status: 'OK',
        tableRow,
        data
    }
    res.json(result)
},
}
module.exports = response