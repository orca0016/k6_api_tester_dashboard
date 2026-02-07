import { scenario_handler_1, scenario_handler_2 } from "./functions";

export const SCENARIOS_LIST = [
  {
    id: "1",
    label: "فرار کاربر",
    handler: scenario_handler_1,
    inputs: [
      {
        type: "text",
        name: "url",
        label: "آدرس"
      },
      {
        type: "select",
        name: "duration",
        label: "مدت تست",
        options: {
          "1s": "یک ثانیه",
          "2s": "دو ثانیه"
        }
      }
    ]
  },
  {
    id: "2",
    label: "هجوم کاربر ",
    handler: scenario_handler_2,
    inputs: [
      {
        type: "text",
        name: "url",
        label: "آدرس"
      },
      {
        type: "select",
        name: "duration",
        label: "مدت تست",
        options: {
          "1s": "یک ثانیه",
          "2s": "دو ثانیه",
          "3s": "سه ثانیه",
          "4s": "چهار ثانیه"
        }
      }
    ]
  }
];
