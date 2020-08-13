export const TEST_STRING = () => '<b>THIS IS A TEST MESSAGE</b>';

export const ERROR_STRING = (a?: string) => (
  `
    An error has occurred at the server-level.
    Please check the log.

    ${a}
  `
);

export const ERROR_NO_REPLY_ID_ON_CENSOR = (uName: string) => (
  `
    Sorry ${uName}.
    You can only use a censor command when replying to a message.
  `
);

export const CENSOR_MESSAGE = (uName: string, duration: number) => (
  `
    ${uName} was censored for this post.
    Duration: ${duration}
  `
);

export const CENSOR_ERROR = () => (
  `
    Oops! Something went wrong.
    Maybe the user is a channel administrator.
  `
);
