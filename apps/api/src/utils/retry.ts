export const Retry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) {
      throw err;
    }

    console.warn("Retrying... attempts left:", retries);
    // Add incremental delay between retries (1x, 2x, 3x...) to avoid rapid repeated failures
    await new Promise((res) => setTimeout(res, delay * (4 - retries)));
    return Retry(fn, retries - 1, delay);
  }
};
