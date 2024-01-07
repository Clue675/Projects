const moment = require('moment');

/**
 * Formats a date according to the specified format.
 * @param {Date | string} date - The date to format.
 * @param {string} format - The format string (e.g., "YYYY-MM-DD").
 * @returns {string} - The formatted date string.
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
    return moment(date).format(format);
};

/**
 * Calculates the difference between two dates.
 * @param {Date | string} startDate - The start date.
 * @param {Date | string} endDate - The end date.
 * @param {string} unit - The unit of time to measure (e.g., 'days', 'months').
 * @returns {number} - The difference in the specified units.
 */
const dateDiff = (startDate, endDate, unit = 'days') => {
    return moment(endDate).diff(moment(startDate), unit);
};

/**
 * Adds a specified amount of time to a date.
 * @param {Date | string} date - The date to add to.
 * @param {number} amount - The amount of time to add.
 * @param {string} unit - The unit of time (e.g., 'days', 'months').
 * @returns {string} - The new date after addition.
 */
const addTimeToDate = (date, amount, unit = 'days') => {
    return moment(date).add(amount, unit).format('YYYY-MM-DD');
};

/**
 * Subtracts a specified amount of time from a date.
 * @param {Date | string} date - The date to subtract from.
 * @param {number} amount - The amount of time to subtract.
 * @param {string} unit - The unit of time (e.g., 'days', 'months').
 * @returns {string} - The new date after subtraction.
 */
const subtractTimeFromDate = (date, amount, unit = 'days') => {
    return moment(date).subtract(amount, unit).format('YYYY-MM-DD');
};

/**
 * Checks if a date is before another date.
 * @param {Date | string} date1 - The date to check.
 * @param {Date | string} date2 - The date to compare against.
 * @returns {boolean} - True if date1 is before date2, false otherwise.
 */
const isBefore = (date1, date2) => {
    return moment(date1).isBefore(moment(date2));
};

module.exports = { formatDate, dateDiff, addTimeToDate, subtractTimeFromDate, isBefore };
