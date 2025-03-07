import {configureStore} from '@reduxjs/toolkit';
import { databases } from '@/databases/databases';

export default configureStore({
  reducer: {
    counter: databases.reducer,
  },
});
