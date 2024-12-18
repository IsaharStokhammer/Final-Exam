export const createResponse = (
  data: any,
  message: string = "",
  success: boolean = true
) => {
  return { data, message, success };
};
