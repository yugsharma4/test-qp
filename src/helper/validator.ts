export const isValidMobileNumber = (number: string) => {
  const pattern = /^[6789]\d{9}$/;
  return pattern.test(number);
};
