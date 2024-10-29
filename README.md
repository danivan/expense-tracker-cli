# Expense Tracker CLI
A solution to [roadmap.sh](https://roadmap.sh/projects/expense-tracker) expense tracker project

## Overview

The Expense Tracker CLI is a command-line interface for managing personal expenses. You can add, update, delete, and list expenses, as well as get a summary of your expenses for a specific month.

## Installation

To use the Expense Tracker CLI, you need to have Node.js installed on your system. You can install the CLI globally using npm:

```bash
npm install -g expense-tracker-cli
```

## Usage

The CLI provides several commands to manage your expenses:

### Commands

- **add**: Add a new expense
  - Options:
    - `-a, --amount <amount>`: The amount of the expense
    - `-d, --description <description>`: The description of the expense

- **update**: Update an existing expense
  - Options:
    - `-i, --id <id>`: The ID of the expense to update
    - `-a, --amount <amount>`: The new amount of the expense
    - `-d, --description <description>`: The new description of the expense

- **delete**: Delete an existing expense
  - Options:
    - `-i, --id <id>`: The ID of the expense to delete

- **list**: List all expenses

- **summary**: Get a summary of expenses
  - Options:
    - `-m, --month <month>`: The month to filter expenses by (1 for January, 2 for February, etc.)

### Examples

Add a new expense:
```bash
expense-tracker add --amount 50 --description "Lunch"
```

Update an existing expense:
```bash
expense-tracker update --id 1234 --amount 60 --description "Dinner"
```

Delete an expense:
```bash
expense-tracker delete --id 1234
```

List all expenses:
```bash
expense-tracker list
```

Get a summary of expenses for a specific month:
```bash
expense-tracker summary --month 7
```

## License

This project is licensed under the ISC License.

