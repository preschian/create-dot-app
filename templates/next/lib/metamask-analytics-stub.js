/** No-op stub for @metamask/sdk-analytics — avoids telemetry fetch errors in local dev. */
const analytics = {
  enable() {},
  setGlobalProperty() {},
  track() {},
};

module.exports = { analytics };
