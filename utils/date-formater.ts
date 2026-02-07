export const dateFormatter = (createdAt: string) => {
  return new Date(createdAt).toLocaleString("fa-IR", {
    day: "2-digit",
    hour: "2-digit",
    year: "numeric",
    month: "2-digit",
    minute: "2-digit",
  });
};
