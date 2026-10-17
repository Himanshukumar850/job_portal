import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authslice"
import jobSlice from "./jobSlice"
import companyReducer from "./CompanySlice";
import applicationSlice from "./applicationSliice";
import notificationSlice from "./notificationSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  version:1,
  whitelist: ["auth"] 
};
const rootReducer = combineReducers({
    auth:authSlice,
    job: jobSlice,
    company: companyReducer,
    application:applicationSlice,
    notification: notificationSlice,
})
const persistedReducer = persistReducer(persistConfig,rootReducer )

const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

export default store;