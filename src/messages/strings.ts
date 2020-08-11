export const TEST_STRING = () => '<b>THIS IS A TEST MESSAGE</b>';

export const ERROR_STRING = (a?: string) => (
  `
    An error has occurred at the server-level.
    Please check the log.

    ${a}
  `
);
