function getOS() {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (userAgent.indexOf("Windows") != -1) {
    return "Windows";
  }
  if (userAgent.indexOf("Mac") != -1) {
    return "Mac";
  }

  return "unknown";
}

const os = getOS();

export const isMacOS = () => {
  return os === "Mac";
};
