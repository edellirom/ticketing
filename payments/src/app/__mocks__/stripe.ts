import { createId } from '../../utils';

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: createId() })
  }
};
