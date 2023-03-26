const defaults = {
  timeout: 4500,
  interval: 50
};

export function waitForExpect(
  expectation: () => void | Promise<void>,
  timeout = defaults.timeout,
  interval = defaults.interval
) {
  if (interval < 1) interval = 1;
  const maxTries = Math.ceil(timeout / interval);
  let tries = 0;
  return new Promise((resolve, reject) => {
    const rejectOrRerun = (error: Error) => {
      if (tries > maxTries) {
        reject(error);
        return;
      }
      setTimeout(runExpectation, interval);
    };
    function runExpectation() {
      tries += 1;
      try {
        Promise.resolve(expectation()).then(resolve).catch(rejectOrRerun);
      } catch (error) {
        rejectOrRerun(error);
      }
    }
    setTimeout(runExpectation, 0);
  });
}
