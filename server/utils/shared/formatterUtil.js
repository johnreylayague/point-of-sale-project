// errorMessageFormatter.js
const formatErrorMessages = (errorMessages) => {
  let result = "";
  if (errorMessages.length > 1) {
    result =
      errorMessages.slice(0, -1).join(", ") +
      " and " +
      errorMessages[errorMessages.length - 1];
  } else if (errorMessages.length === 1) {
    result = errorMessages[0];
  }
  return result;
};

exports.formatErrorMessages = formatErrorMessages;
