import { getListEnv } from '../../config/env.js';

export const appExpectations = {
  expectedWindowTitles: getListEnv('EXPECTED_WINDOW_TITLES'),
};
