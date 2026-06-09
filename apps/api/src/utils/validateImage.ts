export const validateImageUrl = async (url: string) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Range: "bytes=0-1024", //only fetch 1kb of data to make sure file exists
      },
    });

    const contentType = res.headers.get("content-type");
    const contentLength = res.headers.get("content-length");

    if (!res.ok || contentType?.startsWith("image")) {
      return false;
    }

    // Reject very small/broken images
    if (contentLength && Number(contentLength) < 5000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
