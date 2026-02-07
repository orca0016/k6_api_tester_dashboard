import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    {
      duration: __ENV.DURATION || "2s",
      target: __ENV.VUS ? Number(__ENV.VUS) : 10,
    },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<3000"],
    checks: ["rate>0.90"],
  },
};
let tokens = [];

try {
  tokens = JSON.parse(open("./tokens.json"));
} catch (e) {
  console.log("⚠️ فایل tokens.json پیدا نشد، از توکن پیش‌فرض استفاده می‌کنم");
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function () {
  const token = tokens.length > 0 ? tokens[__VU] : "default-token";
  // const token = randomIntFromInterval(1, 77000);

  const response = http.get(__ENV.FETCH_URL || "http://localhost:3000/api", {
    headers: {
      authorization: token,
      "x-api-key": "s8RR6-dZ.IIo2ZqQm2NCO0.o021Cg",
    },
  });

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  if (response.status !== 200) {
    console.log(
      `❌ VU ${__VU}: status code  ${response.status} - duration ${response.timings.duration}ms - ${token}`,
    );
  }

  sleep(0.5);
}

export function handleSummary(data) {
  const SCENARIO_ID = __ENV.SCENARIO_ID || "default";
  const targetVUs = options.stages[options.stages.length - 1].target;

  const summary = {
    timestamp: new Date().toISOString(),
    testName: "api test",
    scenarioId: SCENARIO_ID,
    totalRequests: data.metrics.http_reqs.values.count,
    avgResponseTime: data.metrics.http_req_duration.values.avg.toFixed(2),
    p95ResponseTime: data.metrics.http_req_duration.values["p(95)"].toFixed(2),
    errorRate: (data.metrics.http_req_failed.values.rate * 100).toFixed(2),
    successRate: (data.metrics.checks.values.rate * 100).toFixed(2),
    targetVUs: targetVUs,
    duration: (data.state.testRunDurationMs / 1000).toFixed(2),
  };

  return {
    stdout: JSON.stringify({
      type: "FINAL_SUMMARY",
      payload: summary,
    }),
  };
}
