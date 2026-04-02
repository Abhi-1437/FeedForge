// Rate limit middleware placeholder
// Implementation intentionally omitted per user request
let requests = {};
let summaryRequests = {};

export const rateLimit = (req, res, next) => {
  const ip = req.ip;

  if (!requests[ip]) requests[ip] = 0;
  requests[ip]++;

  if (requests[ip] > 20) {
    return res.status(429).json({ msg: "Too many requests" });
  }

  setTimeout(() => {
    requests[ip]--;
  }, 60000);

  next();
};

export const summaryRateLimit = (req, res, next) => {
  const userId = req.user?.id || req.ip;

  if (!summaryRequests[userId]) summaryRequests[userId] = 0;
  summaryRequests[userId]++;

  if (summaryRequests[userId] > 10) {
    return res.status(429).json({ msg: "Too many summary requests" });
  }

  setTimeout(() => {
    summaryRequests[userId]--;
  }, 60000);

  next();
};