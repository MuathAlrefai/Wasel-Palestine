import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.10"],
    http_req_duration: ["p(95)<800"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000/api/v1";

export default function () {
  const payload = JSON.stringify({
    category: "CHECKPOINT_DELAY",
    description: `k6 generated report ${Date.now()}`,
    latitude: 32.122,
    longitude: 35.287,
    region: "Nablus",
    reportTime: new Date().toISOString(),
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(`${BASE_URL}/reports`, payload, params);

  check(res, {
    "status is 201 or 200": (r) => r.status === 201 || r.status === 200,
    "has success true": (r) => r.json("success") === true,
  });

  sleep(1);
}
