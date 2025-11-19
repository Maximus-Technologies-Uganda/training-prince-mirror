export const expensesSuccess = {
  data: [
    {
      id: "exp_01",
      amount: 125.75,
      category: "travel",
      date: "2025-11-18",
    },
    {
      id: "exp_02",
      amount: 58.25,
      category: "food",
      date: "2025-11-17",
    },
  ],
  pagination: {
    totalItems: 2,
    currentPage: 1,
    pageSize: 20,
    totalPages: 1,
  },
  requestId: "req_success",
};

export const expensesEmpty = {
  data: [],
  pagination: {
    totalItems: 0,
    currentPage: 1,
    pageSize: 20,
    totalPages: 0,
  },
  requestId: "req_empty",
};

export const expensesErrorEnvelope = {
  message: "Validation failed",
  requestId: "req_error",
};

export const expensesOverPageSize = {
  data: [
    {
      id: "exp_over",
      amount: 1,
      category: "travel",
      date: "2025-11-18",
    },
  ],
  pagination: {
    totalItems: 1,
    currentPage: 1,
    pageSize: 150,
    totalPages: 1,
  },
};
