export function addExpense(entries, entry) {
  return [...entries, entry];
}

export function calculateTotal(entries, filter = null) {
  let category = null;
  if (filter && typeof filter === 'object') {
    category = filter.category || null;
  } else if (typeof filter === 'string') {
    category = filter;
  }

  let list = entries;
  if (category) {
    list = list.filter((item) => item.category === category);
  }
  return list.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

