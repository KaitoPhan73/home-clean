// import cluster from "cluster";

export const RootPath = {
  admin: "/admin",
  manager: "/manager",
  manageLaundry: "/laundry",
  staff: "/staff",
};

export const PATHS = {
  admin: {
    groups: `${RootPath.admin}/groups`,
    areas: `${RootPath.admin}/areas`,
    clusters: `${RootPath.admin}/clusters`,
    buildings: `${RootPath.admin}/buildings`,
    houses: `${RootPath.admin}/houses`,
    rooms: `${RootPath.admin}/rooms`,
    serviceCategories: `${RootPath.admin}/service-categories`,
    services: `${RootPath.admin}/services`,
    managers: `${RootPath.admin}/managers`,
    wallets: `${RootPath.admin}/wallets`,
    staffs: `${RootPath.admin}/staffs`,
    users: `${RootPath.admin}/users`,
    revenues: `${RootPath.admin}/revenues`,
    transactions: `${RootPath.admin}/transactions`,
    transactionRevenue: `${RootPath.admin}/transaction-revenue`,
    feedbacks: `${RootPath.admin}/feedbacks`,
    serviceInHouseTypes: `${RootPath.admin}/service-in-house-types`,
    laundryOrders: `${RootPath.admin}/laundry-orders`,
    // orderHistory: `${RootPath.admin}/order-history`,
    tasks: `${RootPath.admin}/tasks`,
    itemTypes: `${RootPath.admin}/item-types`,
    serviceTypes: `${RootPath.admin}/service-types`,
    additionalServices: `${RootPath.admin}/additional-services`,
  },

  manager: {
    groups: `${RootPath.manager}/groups`,
    timeSlots: `${RootPath.manager}/time-slots`,
    orderAssignment: `${RootPath.manager}/order-assignment`,
    profile: `${RootPath.manager}/profile`,
    // laundry: `${RootPath.manager}/laundry`,
  },

  laundry: {
    orders: `${RootPath.manageLaundry}/orders`,
    employees: `${RootPath.manageLaundry}/employees`,
  },

  staff: {
    myTasks: `${RootPath.staff}/my-tasks`,
    schedule: `${RootPath.staff}/schedule`,
    guides: `${RootPath.staff}/guides`,
    feedback: `${RootPath.staff}/feedback`,
  },
};
