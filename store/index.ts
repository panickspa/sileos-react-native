import {configureStore} from '@reduxjs/toolkit';
import counterReducer from '../features/databases/databases';

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
