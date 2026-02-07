import { IResponseK6Test } from "@/types/scenario";
import { spawn } from "child_process";
import path from "path";

export async function runTest({
  duration,
  fetchUrl,
  targetVUs,
  scenarioId,
}: {
  targetVUs: number;
  duration: string;
  fetchUrl: string;
  scenarioId: string;
}) {
  return new Promise<IResponseK6Test>((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "k6/script.js");
    let finalSummary: any = null;

    const k6 = spawn("k6", [
      "run",
      scriptPath,
      "--env",
      `VUS=${targetVUs}`,
      "--env",
      `DURATION=${duration}`,
      "--env",
      `SCENARIO_ID=${scenarioId}`,
      "--env",
      `FETCH_URL=${fetchUrl}`,
    ]);

    k6.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      try {
        const match = text.match(/{\"type\":\"FINAL_SUMMARY\".*}/);

        if (match) {
          const parsed = JSON.parse(match[0]);
          finalSummary = parsed.payload;
        }
      } catch (e) {}
    });

    k6.stderr.on("data", (chunk) => {
      console.error(chunk.toString());
    });

    k6.on("close", () => {
      if (!finalSummary) {
        return reject("Summary not found");
      }

      resolve(finalSummary);
    });
  });
}