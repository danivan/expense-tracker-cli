import { randomUUID } from 'crypto';
import fs from 'fs';

const filePath = 'expenses.json';

/**
 * Adds a new expense to the 'expenses.json' file. If the file does not exist,
 * it will be created. Each expense includes a unique ID, the current date,
 * the specified amount, and description. If there is an error reading or writing
 * to the file, an error message will be logged to the console.
 *
 * @param {Object} params - The expense details.
 * @param {number} params.amount - The amount of the expense.
 * @param {string} params.description - The description of the expense.
 */
export async function addExpense({
  amount,
  description,
}: {
  amount: number;
  description: string;
}): Promise<void> {
  if (typeof amount !== 'number') {
    throw new TypeError('amount must be a number');
  }

  if (typeof description !== 'string') {
    throw new TypeError('description must be a string');
  }

  const expense = {
    id: randomUUID(),
    date: new Date().toLocaleDateString(),
    amount,
    description,
  };

  let expenses = [];

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    expenses = JSON.parse(data) as Array<Record<string, unknown>>;
    expenses.push(expense);
  } catch (err: NodeJS.ErrnoException | any) {
    if (err.code !== 'ENOENT') {
      console.error('Error adding expense:', err);
      return;
    }
    expenses = [expense];
  }

  try {
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(expenses, null, 2),
      'utf8'
    );

    console.log(`Expense added successfully (ID: ${expense.id})`);
  } catch (error) {
    console.error('Error adding expense:', error);
  }
}

/**
 * Updates an expense in the 'expenses.json' file. If the file does not exist,
 * an error message will be logged to the console. If no id is provided, an error
 * message will be logged to the console and the function will return. If both
 * amount and description is provided, an error message will be logged to the
 * console and the function will return. If there is an error reading or writing
 * to the file, an error message will be logged to the console.
 *
 * @param {Object} params - The expense details.
 * @param {string} params.id - The id of the expense to update.
 * @param {number} [params.amount] - The new amount of the expense.
 * @param {string} [params.description] - The new description of the expense.
 */
export async function updateExpense({
  id,
  amount,
  description,
}: {
  id: string;
  amount?: number;
  description?: string;
}) {
  if (!id) {
    console.error('Please provide an id');
    return;
  }

  if (!amount && !description) {
    console.error('Please provide either amount or description');
    return;
  }

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const expenses = JSON.parse(data || '[]');
    expenses.forEach(
      (expense: { id: string; amount: number; description: string }) => {
        if (expense.id === id) {
          expense.amount = amount || expense.amount;
          expense.description = description || expense.description;
        }
      }
    );

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(expenses, null, 2),
      'utf8'
    );
    console.log(`Expense updated successfully (ID: ${id})`);
  } catch (err) {
    console.error('Error reading or writing to the file:', err);
  }
}

/**
 * Prints a table of all expenses to the console. If there is an error
 * reading the file, an error message will be logged to the console.
 */
export function listExpenses() {
  try {
    console.table(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  } catch (error: NodeJS.ErrnoException | any) {
    if (error.code !== 'ENOENT') {
      console.error('No expense record found', error);
      return;
    }
  }
}

/**
 * Deletes an expense from the 'expenses.json' file. If the file does not exist,
 * or if there is an error reading or writing to the file, an error message will
 * be logged to the console. If the specified id does not match any expense,
 * no changes will be made to the file.
 *
 * @param {string} id - The id of the expense to delete.
 */
export function deleteExpense(id: string) {
  if (!id) {
    console.error('Please provide an id');
    return;
  }
  try {
    const expenses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updatedExpenses = expenses.filter(
      (expense: { id: string }) => expense.id !== id
    );
    fs.writeFileSync(filePath, JSON.stringify(updatedExpenses, null, 2));
    console.log('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
}

/**
 * Prints the total of all expenses to the console. If the file does not exist,
 * or if there is an error reading the file, an error message will be logged to
 * the console.
 *
 * @param {number} [month] - The month to filter expenses by.
 */
export function getSummary(month?: number) {
  try {
    const expenses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const totalExpenses = expenses.reduce(
      (total: number, expense: { amount: number; date: string }) => {
        const expenseDate = new Date(expense.date);
        if (
          month &&
          expenseDate.getMonth() !== month &&
          expenseDate.getFullYear() !== new Date().getFullYear()
        ) {
          return total;
        }

        return total + Number(expense.amount || 0);
      },
      0
    );

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let output = `Total expenses: ${totalExpenses}`;
    if (month) {
      output = `Total expenses in ${months[month - 1]}: ${totalExpenses}`;
    }
    console.log(output);
  } catch (error: NodeJS.ErrnoException | any) {
    if (error.code === 'ENOENT') {
      console.error('No expense record found');
      return;
    }
    throw error;
  }
}
