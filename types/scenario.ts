// types/scenario.ts

export interface ScenarioInput {
  name: string;
  label: string;
  type: "text" | "select";
  options?: Record<string, string>;
}
export interface IResponseK6Test {
  testName: string;
  duration: string;
  timestamp: string;
  errorRate: string;
  targetVUs: number;
  scenarioId: string;
  successRate: string;
  totalRequests: number;
  avgResponseTime: string;
  p95ResponseTime: string;
}
export interface ScenarioHandlerInput {
  fetchUrl: string;
  duration: string;
  scenarioId: string;
}

export interface ScenarioHandlerOutput {
  results: IResponseK6Test[];
}
export interface IResponseScenarioTestBody {
  success: boolean;
  result: IResponseK6Test[];
}
export interface IListHistory {
  testId: string;
  urlTest:string;
  caption: string;
  createdAt: string;
  history: IResponseK6Test[];
}
