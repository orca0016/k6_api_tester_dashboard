"use client";

import { SubmitEvent, useState } from "react";
import { SCENARIOS_LIST } from "../scenarios/scenarios-list";
import { v6 as uuid6 } from "uuid";
import { IResponseScenarioTestBody } from "../types/scenario";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HistoryIcon, LoadingIcon } from "@/icons/icons";

export default function Home() {
  const [selectedScenarioId, setSelectedScenarioId] = useState("0");
  const [loading, setLoading] = useState(false);
  const selectedScenario = SCENARIOS_LIST.find(
    (s) => s.id === selectedScenarioId,
  );

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
      const values = Object.fromEntries(new FormData(e.currentTarget));

      const response = await fetch("/api/test", {
        method: "POST",
        body: JSON.stringify({
          fetchUrl: values.url,
          duration: values.duration,
          scenarioId: values.scenarioId,
        }),
      }).finally(() => setLoading(false));
      if (response.status===400) {
        alert('لطفا تمام فیلد های مورد نیاز را پر کنید.');
      }
      const data = (await response.json()) as IResponseScenarioTestBody;

      const testId = uuid6();
      const history = JSON.parse(localStorage.getItem("test-history") || "[]");

      history.push({
        testId,
        urlTest: values.url,
        caption: values.caption,
        history: [...data.result],
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("test-history", JSON.stringify(history));
      redirect("/history");
  
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen text-gray-900 flex-col">
      <div className="text-right min-w-100 text-2xl font-semibold my-4 underline">
        <Link href={"/history"} className="flex items-center justify-end">
          تاریخچه تست ها <HistoryIcon />
        </Link>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 bg-white text-gray-900 px-10 py-8 min-w-100 shadow-2xl rounded-md"
      >
        <h1 dir="rtl" className="text-gray-900 text-2xl font-bold">
          {" "}
          ساختن یک تست 🎯
        </h1>
        <div className="flex gap-2">
          <input
            name="caption"
            type="text"
            className="p-2 bg-gray-200 rounded-md flex-1"
          />
          <label>کپشن تست</label>
        </div>

        {/* انتخاب سناریو */}
        <div className="w-full flex gap-2">
          <select
            name="scenarioId"
            value={selectedScenarioId}
            className="p-2 bg-gray-200 rounded-md flex-1"
            onChange={(e) => setSelectedScenarioId(e.target.value)}
          >
            <option>select a scenario</option>
            {SCENARIOS_LIST.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.label}
              </option>
            ))}
          </select>
          <label> سناریو ها</label>
        </div>
        {/* رندر داینامیک inputs */}
        {selectedScenario?.inputs.map((input) => {
          if (input.type === "text") {
            return (
              <div key={input.name} className="flex gap-2">
                <input
                  name={input.name}
                  type="text"
                  className="p-2 bg-gray-200 rounded-md flex-1"
                />
                <label>{input.label}</label>
              </div>
            );
          }

          if (input.type === "select") {
            return (
              <div key={input.name} className="w-full flex gap-2">
                <select
                  name={input.name}
                  className="p-2 bg-gray-200 rounded-md flex-1"
                >
                  {Object.entries(input?.options || {}).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
                <label>{input.label}</label>
              </div>
            );
          }

          return null;
        })}

        <button
          className="w-full bg-gray-900 py-2 px-3 text-white rounded-md cursor-pointer flex justify-center disabled:bg-gray-600"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="text-lg animate-spin ">
              <LoadingIcon />
            </span>
          ) : (
            <span>شروع تست</span>
          )}
        </button>
      </form>
    </div>
  );
}
