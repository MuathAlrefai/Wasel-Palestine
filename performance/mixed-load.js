import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "45s",
  thresholds: {
    http_req_failed: ["rate<0.10"],
    http_req_duration: ["p(95)<900"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000/api/v1";

export default function () {
  const action = Math.random();

  if (action < 0.7) {
    const res = http.get(`${BASE_URL}/incidents?page=1&size=10`);

    check(res, {
      "incident list 200": (r) => r.status === 200,
      "incident list success": (r) => r.json("success") === true,
    });
  } else {
    const payload = JSON.stringify({
      category: "CHECKPOINT_DELAY",
      description: `mixed load report ${Date.now()}-${Math.random()}`,
      latitude: 32.122,
      longitude: 35.287,
      region: "Nablus",
      reportTime: new Date().toISOString(),
    });

    const res = http.post(`${BASE_URL}/reports`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    check(res, {
      "report created": (r) => r.status === 201 || r.status === 200,
      "report success": (r) => r.json("success") === true,
    });
  }

  sleep(1);
}
