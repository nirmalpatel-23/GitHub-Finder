import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";
import { data } from "autoprefixer";

const GithubContext = createContext();

const GITHUB_URL = import.meta.env.VITE_GITHUB_URL;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    loading: false,
    repos: [],
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Get Search USers
  const searchUsers = async (text) => {
    setLoading();

    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`);
    const { items } = await response.json();

    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  // Get Single user
  const getUser = async (login) => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users/${login}`);

    if (response.status === 404) {
      window.location = "./notfound";
    } else {
      const data = await response.json();
      // Ahi aapde payload ma data direct mokaliye chiye.
      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  // Repos
  const getUserRepos = async (login) => {
    const response = await fetch(`${GITHUB_URL}/users/${login}/repos`);

    if (response.status === 404) {
      window.location = "./notfound";
    } else {
      const data = await response.json();
      dispatch({
        type: "GET_USER_REPOS",
        payload: data,
      });
    }
  };

  // Clear Dispatch
  const clearUsers = () =>
    dispatch({
      type: "CLEAR_USERS",
    });

  // set loading

  const setLoading = () =>
    dispatch({
      type: "SET_LOADING",
    });

  // naaahre
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
