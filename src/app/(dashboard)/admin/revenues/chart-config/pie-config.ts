import { ChartOptions } from "chart.js";

export const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        boxWidth: 12,
        padding: 15,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 8,
      callbacks: {
        label: function (context) {
          let label = context.label || "";
          if (label) {
            label += ": ";
          }
          if (context.dataset.label === "Doanh thu") {
            label += new Intl.NumberFormat("vi-VN").format(context.parsed) + " VND";
          } else if (context.dataset.label === "Phần trăm") {
            label += context.parsed + "%";
          } else {
            label += context.parsed + " đơn";
          }
          return label;
        },
      },
    },
  },
};