"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { BackIcon } from "@/icons/icons";
import { IListHistory } from "@/types/scenario";
import { dateFormatter } from "@/utils/date-formater";
import { Chart, ChartConfiguration, ChartData } from "chart.js/auto";

export default function HistoryPage() {
  const historyTestList: IListHistory[] = JSON.parse(
    localStorage.getItem("test-history") || "[]",
  );
  const [selectedHistory, setSelectedHistory] = useState<IListHistory | null>(
    historyTestList[historyTestList.length - 1],
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const colors = {
    purple: {
      default: "rgba(149, 76, 233, 1)",
      half: "rgba(149, 76, 233, 0.5)",
      quarter: "rgba(149, 76, 233, 0.25)",
      zero: "rgba(149, 76, 233, 0)",
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!selectedHistory) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);

    const dataPoints = selectedHistory.history.map((item) =>
      Number(item.avgResponseTime),
    );

    const dataLabels = selectedHistory.history.map((item) => item.targetVUs);

    const data: ChartData<"line"> = {
      labels: dataLabels,
      datasets: [
        {
          label: "Average Response Time",
          data: dataPoints,
          fill: true,
          backgroundColor: gradient,
          borderColor: colors.purple.default,
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 3,
          pointBackgroundColor: colors.purple.default,
        },
      ],
    };

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "nearest",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const index = items[0].dataIndex;
                const item = selectedHistory.history[index];
                return `Target VUs: ${item.targetVUs}`;
              },
              label: (context) => {
                const item = selectedHistory.history[context.dataIndex];
                return [
                  `Avg Response: ${Number(item.avgResponseTime).toFixed(2)} ms`,
                  `P95 Response: ${Number(item.p95ResponseTime).toFixed(2)} ms`,
                  `Success Rate: ${item.successRate}%`,
                  `Error Rate: ${item.errorRate}%`,
                  `Total Requests: ${item.totalRequests}`,
                  `Duration: ${item.duration}s`,
                ];
              },
              afterLabel: (context) => {
                const item = selectedHistory.history[context.dataIndex];
                return `🕒 ${new Date(item.timestamp).toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Response Time (ms)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Target VUs",
            },
          },
        },
      },
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [selectedHistory]);
  const handleShowHistory = (testId: string) => {
    const currentHistory =
      historyTestList.find((item) => item.testId === testId) || null;
    setSelectedHistory(currentHistory);
  };
  const avgErrorCalculator = (item: IListHistory) => {
    const errors = item.history.map((i) => Number(i.errorRate));
    const totalError = errors.reduce((i, prev) => i + prev);

    return Math.floor(totalError / errors.length);
  };
  const avgSuccessCalculator = (item: IListHistory) => {
    const errors = item.history.map((i) => Number(i.successRate));
    const totalError = errors.reduce((i, prev) => i + prev);

    return Math.floor(totalError / errors.length);
  };
  const avgRequestCalculator = (item: IListHistory) => {
    const errors = item.history.map((i) => Number(i.totalRequests));
    const totalError = errors.reduce((i, prev) => i + prev);

    return Math.floor(totalError / errors.length);
  };
  const avgDurationCalculator = (item: IListHistory) => {
    const errors = item.history.map((i) => Number(i.duration));
    const totalError = errors.reduce((i, prev) => i + prev);

    return (totalError / errors.length).toFixed(2);
  };

  return (
    <div className="bg-gray-100 flex flex-col gap-4 items-center justify-center min-h-screen text-gray-900  overflow-y-auto py-20">
      <div className="w-299" dir="rtl">
        <Link
          href={"/"}
          className="font-semibold text-2xl textgray-900 flex items-center"
        >
          <span className="rotate-180">
            <BackIcon />
          </span>{" "}
          برگشت صفحه اصلی{" "}
        </Link>
      </div>
      <div className="flex gap-5 max-h-155">
        <div className="flex flex-col gap-4 ">
          <div className="text-sm w-4xl bg-white rounded-md p-3 shadow-2xl">
            <p className="font-semibold"> ادرس تست:</p>{" "}
            <span>{selectedHistory?.urlTest ?? " - not found any url - "}</span>
          </div>
          <div className="text-sm w-4xl bg-white rounded-md p-3 text-right shadow-2xl">
           <span className="font-semibold"> زمان انجام تست :{" "}</span>
            <span className="w-full">
              {selectedHistory?.createdAt
                ? dateFormatter(selectedHistory?.createdAt)
                : " - not found any date - "}
            </span>
          </div>
          <div className="w-full max-w-4xl min-h-100 bg-white rounded-md p-3 shadow-2xl flex-1">
            <canvas ref={canvasRef} />
          </div>
        </div>
        <div className="w-70 flex-1 bg-white rounded-md p-3 shadow-2xl flex flex-col overflow-y-auto gap-4">
          {historyTestList.map((item, index) => (
            <div
              key={index}
              className={` bg-gray-100 rounded-md flex flex-col items-end gap-4 px-2 py-3 shadow ${
                item.testId === selectedHistory?.testId ? "shadow-gray-500" : ""
              }`}
            >
              <span
                dir="rtl"
                className="text-xl font-semibold border-b border-gray-200 pb-2 w-full"
              >
                {item.caption}
              </span>
              <div
                dir="rtl"
                className="w-full flex justify-between border-b border-gray-200 pb-2"
              >
                <span className="font-bold">❌ میانگین خطا :</span>
                <span className="border border-gray-700 text-sm h-fit bg-gray-700 text-white rounded-full px-1 w-fit">
                  {" "}
                  %{avgErrorCalculator(item)}{" "}
                </span>
              </div>
              <div
                dir="rtl"
                className="w-full flex justify-between border-b border-gray-200 pb-2"
              >
                <span className="font-bold">✅ میانگین موفقیت : </span>
                <span className="border border-gray-700 text-sm h-fit bg-gray-700 text-white rounded-full px-1 w-fit">
                  %{avgSuccessCalculator(item)}{" "}
                </span>
              </div>
              <div
                dir="rtl"
                className="w-full flex justify-between border-b border-gray-200 pb-2"
              >
                <span className="font-bold">📊 میانگین درخواست : </span>
                <span className="border border-gray-700 text-sm h-fit bg-gray-700 text-white rounded-full px-1 w-fit">
                  {avgRequestCalculator(item)}{" "}
                </span>
              </div>
              <div
                dir="rtl"
                className="w-full flex justify-between border-b border-gray-200 pb-2"
              >
                <span className="font-bold">🧪 میانگین زمان هر تست : </span>
                <span className="border border-gray-700 text-sm h-fit bg-gray-700 text-white rounded-full px-1 w-fit">
                  {avgDurationCalculator(item)}s{" "}
                </span>
              </div>
              <button
                onClick={() => handleShowHistory(item.testId)}
                className="bg-gray-900 text-white px-2 py-1 rounded-md cursor-pointer flex items-center gap-2"
              >
                <span>نمایش</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
