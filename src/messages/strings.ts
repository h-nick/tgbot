export const TEST_STRING = () => '<b>THIS IS A TEST MESSAGE</b>';

export const ERROR_STRING = (a?: string) => (
  `
    An error has occurred at the server-level.
    Please check the log.

    ${a}
  `
);

export const ERROR_NO_REPLY_ID_ON_CENSOR = () => (
  `
     You can only use the censor command when replying to a message.
  `
);

export const CENSOR_MESSAGE = (uName: string, duration: number) => (
  `
    ${uName} was censored for this post.
    Duration: ${duration} seconds.
  `
);

export const CENSOR_ERROR = () => (
  `
    Oops! Something went wrong.
    Maybe the user is a channel administrator.
  `
);

export const YT_NO_QUERY = () => (
  `
    You must use this command responding to another text message \
    or by following it with a search query.
  `
);

export const YT_NOT_FOUND = (searchParam: string) => (
  'Too bad! I could not find any YouTube video with this query: \n'
  + `<b>"${searchParam}"</b>`
);

export const YT_FOUND = (link: string) => (
  'I found the following video: \n'
  + `<b>${link}</b>`
);

export const DAILY_PAIR = (links: string[], prize: string) => (
  `<b>A PAIR HAS BEEN CHOSEN FOR THE DAY</b> \n
  THE WINNERS ARE: \n
  ${links[0]} + ${links[1]} \n
  AND THEIR PRIZE IS: ${prize}
  `
);
