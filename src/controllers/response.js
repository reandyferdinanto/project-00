const response = (statusCode, message, datas, res) => {
  res.status(statusCode).json({
    payload: {
      status_code: statusCode,
      message: message,
      datas: datas || [],
    },
  });
};

module.exports = response;
