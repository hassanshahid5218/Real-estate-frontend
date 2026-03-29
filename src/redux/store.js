import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  userReducer  from './user/user slice.js'
import { persistReducer, persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};


const rootReducer=combineReducers({user:userReducer})
 
const persistconfig={
   key:'root',
   storage,
   version:1

}


const persisReducer=persistReducer(persistconfig,rootReducer)


export const store = configureStore({
  reducer: persisReducer,
  middleware:(getDefaultmiddleware)=>
    getDefaultmiddleware({
        serializableCheck:false
    }),
})

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch

export const persistor=persistStore(store);