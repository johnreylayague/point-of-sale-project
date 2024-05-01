const isDurationPassed = (dateValue) => {
  const tokenDate = new Date(dateValue);
  const currentDate = new Date();

  const diffMs = currentDate - tokenDate;
  const durationMs = process.env.RESET_PASSWORD_EXPIRATION_MINUTES * 60 * 1000;
  return diffMs >= durationMs;
};

exports.isDurationPassed = isDurationPassed;
