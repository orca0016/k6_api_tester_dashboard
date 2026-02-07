import { runTest } from "@/scenarios/functions";
import { SCENARIOS_LIST } from "@/scenarios/scenarios-list";
import { spawn } from "child_process";
import path from "path";


export async function POST(req: Request) {
  const {  fetchUrl, duration, scenarioId } =
    await req.json();

  if ( !fetchUrl || !duration|| !scenarioId) {
    return Response.json({ error: "Invalid params" }, { status: 400 });
  }
  
  const scenario = SCENARIOS_LIST.find((s) => s.id === scenarioId);
  
  if (!scenario) return Response.json({ error: "Invalid scenario Id" }, { status: 401 });

    // const testId = uuid6();

    const result = await scenario.handler({
      fetchUrl,
      duration,
      scenarioId,
      VUSUsersList:scenario.VUSUsersList
    });

  // const result = await runTest({ targetVUs, fetchUrl, duration, scenarioId });

  return Response.json({
    success: true,
    result
  });

  // const k6 = spawn("k6", [
  //   "run",
  //   scriptPath,
  //   "--env",
  //   `VUS=${targetVUs}`,
  //   "--env",
  //   `DURATION=${duration}`,
  //   "--env",
  //   `SCENARIO_ID=${scenarioId}`,
  //   "--env",
  //   `FETCH_URL=${fetchUrl}`,
  // ]);
  // await k6.stdout.on("data", (data) => {
  //   console.log("k6:", data.toString());
  // });

  // await k6.stderr.on("data", (data) => {
  //   data = data
  //   console.error("k6 error:", data.toString());
  // });

  // await k6.on("close", (code) => {
  //   console.log("k6 finished", code);
  // });
}
