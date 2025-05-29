import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  findTasksWithFilters: jest.fn(),
  findTaskById: jest.fn(),
  createTask: jest.fn(),
  removeTask: jest.fn(),
  updateTaskStatus: jest.fn(),
});

const mockUser = {
  id: '1',
  username: 'test',
  email: 'test@test.com',
  password: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('TaskService', () => {
  let taskService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();

    expect(taskRepository).toBeDefined();
  });

  describe('getTasks', () => {
    it('call TaskRepository.getTasks and return the result', async () => {
      expect(taskRepository['findTasksWithFilters']).not.toHaveBeenCalled();
      (taskRepository['findTasksWithFilters'] as jest.Mock).mockResolvedValue({
        tasks: [],
        total: 0,
      });

      const result = await taskService.getTasksWithFilters({}, mockUser);
      expect(taskRepository['findTasksWithFilters']).toHaveBeenCalled();
      expect(result).toEqual({
        tasks: [],
        total: 0,
      });
    });

    it('should throw an error if the TaskRepository.getTasks method throws an error', async () => {
      (taskRepository['findTasksWithFilters'] as jest.Mock).mockRejectedValue(
        new Error('Test error'),
      );

      await expect(
        taskService.getTasksWithFilters({}, mockUser),
      ).rejects.toThrow('Test error');
    });

    it('call TaskRepository.findTaskById and return the result', async () => {
      expect(taskRepository['findTaskById']).not.toHaveBeenCalled();
      (taskRepository['findTaskById'] as jest.Mock).mockResolvedValue({
        id: '1',
        title: 'Test task',
        description: 'Test description',
        status: 'OPEN',
      });

      const result = await taskService.getTaskById('1', mockUser);
      expect(taskRepository['findTaskById']).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        title: 'Test task',
        description: 'Test description',
        status: 'OPEN',
      });
    });

    it('should throw an error if the TaskRepository.findTaskById method throws an error', async () => {
      (taskRepository['findTaskById'] as jest.Mock).mockRejectedValue(
        new Error('Test error'),
      );

      await expect(taskService.getTaskById('1', mockUser)).rejects.toThrow(
        'Test error',
      );
    });

    it('call TaskRepository.createTask and return the result', async () => {
      expect(taskRepository['createTask']).not.toHaveBeenCalled();
      (taskRepository['createTask'] as jest.Mock).mockResolvedValue({
        id: '1',
        title: 'Test task',
        description: 'Test description',
        status: 'OPEN',
      });

      const result = await taskService.createTask(
        { title: 'Test task', description: 'Test description' },
        mockUser,
      );
      expect(taskRepository['createTask']).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        title: 'Test task',
        description: 'Test description',
        status: 'OPEN',
      });
    });

    it('should throw an error if the TaskRepository.createTask method throws an error', async () => {
      (taskRepository['createTask'] as jest.Mock).mockRejectedValue(
        new Error('Test error'),
      );

      await expect(
        taskService.createTask(
          { title: 'Test task', description: 'Test description' },
          mockUser,
        ),
      ).rejects.toThrow('Test error');
    });
  });
});
