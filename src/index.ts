#! /usr/bin/env node

import { Command } from 'commander';
import {
  addExpense,
  updateExpense,
  listExpenses,
  deleteExpense,
  getSummary,
} from './actions';

async function main() {
  const program = new Command();

  program
    .name('expense-tracker-cli')
    .description('CLI for managing expenses')
    .version('1.0.0')
    .option('-a, --amount <amount>', 'amount of expense')
    .option('-d, --description <description>', 'description of expense')
    .option('-i, --id <id>', 'id of expense')
    .option('-m, --month <month>', 'month of expense');

  program
    .command('add')
    .description('Add a new expense')
    .action(() => {
      const options = program.opts();
      addExpense({
        amount: Number(options.amount),
        description: options.description,
      });
    });

  program
    .command('update')
    .description('Update existing expense')
    .action(() => {
      const options = program.opts();
      updateExpense({
        id: options.id,
        amount: options.amount,
        description: options.description,
      });
    });

  program
    .command('delete')
    .description('Delete existing expense')
    .action(() => {
      const options = program.opts();
      deleteExpense(options.id);
    });

  program
    .command('list')
    .description('List all expenses')
    .action(() => {
      listExpenses();
    });

  program
    .command('summary')
    .description('Get summary of expenses')
    .action(() => {
      const options = program.opts();
      getSummary(Number(options.month));
    });

  await program.parseAsync();
}

try {
  main();
} catch (error) {
  console.error(error);
}
