import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 15,
  duration: "2m",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<700"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000/api/v1";

export default function () {
  const res = http.get(`${BASE_URL}/incidents?page=1&size=10`);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
