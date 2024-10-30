import fs, { writeFile } from 'fs';
import {
  addExpense,
  updateExpense,
  deleteExpense,
  listExpenses,
  getSummary,
} from '../src/actions';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  promises: {
    ...jest.requireActual('fs/promises'),
    writeFile: jest.fn(),
    readFile: jest.fn(),
  },
}));

const mockedWriteFileSync = fs.writeFileSync as jest.Mock;
const mockedReadFileSync = fs.readFileSync as jest.Mock;
const mockedWriteFile = fs.promises.writeFile as jest.Mock;
const mockedReadFile = fs.promises.readFile as jest.Mock;
const mockFilePath = 'expenses.json';

describe('actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addExpense', () => {
    it('should add an expense to the file', async () => {
      const mockData: never[] = [];
      const expense = { amount: 100, description: 'Test Expense' };

      const mockedDataString = JSON.stringify(mockData);
      mockedReadFile.mockResolvedValueOnce(mockedDataString);

      await addExpense(expense);

      expect(mockedReadFile).toHaveBeenCalledWith(mockFilePath, 'utf8');
      expect(mockedWriteFile).toHaveBeenCalled();
    });
  });

  describe('updateExpense', () => {
    it('should update an existing expense', async () => {
      const mockData = [{ id: '1', amount: 100, description: 'Test Expense' }];
      const updatedExpense = {
        id: '1',
        amount: 200,
        description: 'Updated Expense',
      };

      mockedReadFile.mockResolvedValueOnce(JSON.stringify(mockData));

      await updateExpense(updatedExpense);

      expect(mockedReadFile).toHaveBeenCalledWith(mockFilePath, 'utf8');
      expect(mockedWriteFile).toHaveBeenCalled();
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense by id', () => {
      const mockData = [{ id: '1', amount: 100, description: 'Test Expense' }];

      mockedReadFileSync.mockReturnValueOnce(JSON.stringify(mockData));
      mockedWriteFileSync.mockImplementationOnce(() => {});

      deleteExpense('1');

      expect(mockedReadFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');
      expect(mockedWriteFileSync).toHaveBeenCalled();
    });
  });

  describe('listExpenses', () => {
    it('should list all expenses', () => {
      const mockData = [{ id: '1', amount: 100, description: 'Test Expense' }];

      mockedReadFileSync.mockReturnValueOnce(JSON.stringify(mockData));
      console.table = jest.fn();

      listExpenses();

      expect(mockedReadFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');
      expect(console.table).toHaveBeenCalledWith(mockData);
    });

    it('should log an error if file not found', () => {
      mockedReadFileSync.mockImplementationOnce(() => {
        throw { code: 'ENOENT' };
      });
      console.table = jest.fn();

      listExpenses();

      expect(mockedReadFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');
      expect(console.table).not.toHaveBeenCalled();
    });
  });

  describe('getSummary', () => {
    it('should print the total of all expenses', () => {
      const mockData = [
        {
          id: '1',
          amount: 100,
          description: 'Test Expense',
          date: new Date().toLocaleDateString(),
        },
      ];

      mockedReadFileSync.mockReturnValueOnce(JSON.stringify(mockData));
      console.log = jest.fn();

      getSummary();

      expect(mockedReadFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');
      expect(console.log).toHaveBeenCalledWith('Total expenses: 100');
    });
  });
});
