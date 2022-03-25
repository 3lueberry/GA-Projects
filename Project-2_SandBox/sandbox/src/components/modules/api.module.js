// import { useSelector, useDispatch } from "react-redux";
// import { userActions } from "../store/user";
// import { authActions } from "../store/auth";
// import { loaderActions } from "../store/loader";
// import axios from "axios";

// const useGetToken = async (signal) => {
//   const dispatchStore = useDispatch();
//   dispatchStore(loaderActions.setIsLoading());
//   dispatchStore(loaderActions.clearError());
//   let res = null;
//   const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`;
//   const headers = { "Content-Type": "application/json" };
//   const body = JSON.stringify({ returnSecureToken: true });
//   try {
//     res = await axios.post(url, body, { signal, headers });
//     console.log(res);
//     if (res.status === 200) {
//       console.log(res.data);
//       dispatchStore(
//         authActions.setAuth({
//           token: res.data.idToken,
//           refresh: res.data.refreshToken,
//           time: Date.now(),
//         })
//       );
//     }
//   } catch (err) {
//     dispatchStore(loaderActions.setError(err));
//   }
//   dispatchStore(loaderActions.doneLoading());
//   return res;
// };

// const useRefreshToken = async (signal) => {
//   const dispatchStore = useDispatch();
//   const refresh = useSelector((state) => state.auth.refresh);
//   dispatchStore(loaderActions.setIsLoading());
//   dispatchStore(loaderActions.clearError());
//   let res = null;
//   const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_FIREBASE_KEY}`;
//   const headers = { "Content-Type": "application/x-www-form-urlencoded" };
//   const body = `grant_type=refresh_token&refresh_token=${refresh}`;
//   try {
//     const res = await axios.post(url, body, { signal, headers });
//     console.log(res);
//     if (res.status === 200) {
//       console.log(res.data);
//       dispatchStore(
//         authActions.setAuth({
//           token: res.data.id_token,
//           refresh: res.data.refresh_token,
//           time: Date.now(),
//         })
//       );
//     }
//   } catch (err) {
//     dispatchStore(loaderActions.setError(err));
//   }
//   dispatchStore(loaderActions.doneLoading());
//   return res;
// };

// exports.useGetToken = useGetToken;
// exports.useRefreshToken = useRefreshToken;
