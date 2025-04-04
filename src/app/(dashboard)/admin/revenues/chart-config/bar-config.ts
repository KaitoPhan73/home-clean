import { ChartOptions } from "chart.js";

export const getBarChartOptions = (title: string): ChartOptions<"bar"> => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: title,
      font: { size: 14, weight: "bold" },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (label.includes("Doanh thu")) {
            label += new Intl.NumberFormat("vi-VN").format(context.parsed.x) + " VND";
          } else {
            label += context.parsed.x + " đơn";
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Giá trị",
      },
    },
    y: {
      title: {
        display: true,
        text: "Dịch vụ",
      },
    },
  },
});