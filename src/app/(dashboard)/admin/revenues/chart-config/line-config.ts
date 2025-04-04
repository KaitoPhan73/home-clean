import { ChartOptions } from "chart.js";

export const getLineChartOptions = (fromDate: string, toDate: string): ChartOptions<"line"> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        boxWidth: 12,
        padding: 15,
        font: { size: 12 },
      },
    },
    title: {
      display: true,
      text: `Số đơn và Doanh thu theo ngày (${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()})`,
      font: { size: 16, weight: "bold" },
      padding: { top: 10, bottom: 20 },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 8,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.dataset.yAxisID === "y1") {
            label += context.parsed.y + " đơn";
          } else if (context.dataset.yAxisID === "y2") {
            label += new Intl.NumberFormat("vi-VN").format(context.parsed.y) + " VND";
          }
          return label;
        },
      },
    },
  },
  scales: {
    y1: {
      type: "linear" as const,
      position: "left" as const,
      title: {
        display: true,
        text: "Số đơn (orders)",
        font: { size: 12 },
      },
      beginAtZero: true,
      grid: { color: "rgba(0, 0, 0, 0.05)" },
    },
    y2: {
      type: "linear" as const,
      position: "right" as const,
      title: {
        display: true,
        text: "Doanh thu (VND)",
        font: { size: 12 },
      },
      beginAtZero: true,
      grid: { drawOnChartArea: false },
    },
    x: {
      title: {
        display: true,
        text: "Ngày",
        font: { size: 12 },
      },
      grid: { display: false },
    },
  },
});