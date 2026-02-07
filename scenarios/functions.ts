"use server";
import { IResponseK6Test, ScenarioHandlerInput } from "../types/scenario";
import { runTest } from "./rur-test";



export async function scenario_handler_1(
  input: ScenarioHandlerInput,
): Promise<IResponseK6Test[]> {
  const VUS_USERS_LIST=[
    10 ,20, 30,40,50,60 , 70, 80 , 90 , 100
  ]
  const { duration , fetchUrl , scenarioId } = input;
  const results = [];
  for (const currentUser of VUS_USERS_LIST) {
    const res = await runTest({ targetVUs:currentUser, fetchUrl, duration, scenarioId });
    results.push(res);
    await new Promise((r) => setTimeout(r, 500));
  }

  return results;
}
export async function scenario_handler_2(
  input: ScenarioHandlerInput,
): Promise<IResponseK6Test[]> {
  const VUS_USERS_LIST=[
    100 ,150,200 ,300 ,400
  ]
  const { duration , fetchUrl , scenarioId } = input;
  const results = [];
  for (const currentUser of VUS_USERS_LIST) {
    const res = await runTest({ targetVUs:currentUser, fetchUrl, duration, scenarioId });
    results.push(res);
    await new Promise((r) => setTimeout(r, 500));
  }

  return results;
}
