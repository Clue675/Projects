/**
 * Sends a success response.
 * @param {Object} res - The response object.
 * @param {Object} data - The data to be sent in the response.
 * @param {number} statusCode - The HTTP status code (default is 200).
 */
const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
      success: true,
      data: data
  });
};

/**
* Sends an error response.
* @param {Object} res - The response object.
* @param {string} errorMessage - The error message to be sent.
* @param {number} statusCode - The HTTP status code (default is 500).
*/
const sendError = (res, errorMessage, statusCode = 500) => {
  res.status(statusCode).json({
      success: false,
      error: errorMessage
  });
};

module.exports = { sendSuccess, sendError };
