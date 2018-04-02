jest.mock('fs');
process.exit = jest.fn() as any;
jest.mock('../src/printErrors');
