// src/lib/db.js
export const ordersDB = {
  data: [],
  getAll() { return this.data; },
  add(order) { this.data.push(order); },
};

export const bookingsDB = {
  data: [],
  getAll() { return this.data; },
  add(booking) { this.data.push(booking); },
};
