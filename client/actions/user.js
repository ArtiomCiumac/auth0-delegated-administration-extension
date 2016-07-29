import * as constants from '../constants';
import axios from 'axios';

import { fetchUserLogs } from './userLog';
import { fetchUserDevices } from './userDevice';

/*
 * Search for users.
 */
export function fetchUsers(search = '', reset = false, page = 0) {
  return (dispatch, getState) => {
    const users = getState().users.get('records');
    if (reset || search !== '' || !users.size) {
      dispatch({
        type: constants.FETCH_USERS,
        payload: {
          promise: axios.get('/api/users', {
            params: {
              search,
              page
            },
            responseType: 'json'
          })
        },
        meta: {
          page
        }
      });
    }
  };
}

/*
 * Fetch the user details.
 */
export function fetchUserDetail(userId, onSuccess) {
  return {
    type: constants.FETCH_USER,
    meta: {
      userId,
      onSuccess
    },
    payload: {
      promise: axios.get(`/api/users/${userId}`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Fetch the complete user object.
 */
export function fetchUser(userId) {
  return (dispatch) => {
    dispatch(fetchUserDetail(userId));
    dispatch(fetchUserLogs(userId));
    dispatch(fetchUserDevices(userId));
  };
}

/*
 * Get confirmation to remove MFA from a user.
 */
export function requestRemoveMultiFactor(user, provider) {
  return {
    type: constants.REQUEST_REMOVE_MULTIFACTOR,
    user,
    provider
  };
}

/*
 * Cancel the removal process.
 */
export function cancelRemoveMultiFactor() {
  return {
    type: constants.CANCEL_REMOVE_MULTIFACTOR
  };
}

/*
 * Remove multi factor from a user.
 */
export function removeMultiFactor() {
  return (dispatch, getState) => {
    const { userId, provider } = getState().mfa.toJS();
    dispatch({
      type: constants.REMOVE_MULTIFACTOR,
      payload: {
        promise: axios.delete(`/api/users/${userId}/multifactor/${provider}`, {
          responseType: 'json'
        })
      },
      meta: {
        userId,
        onSuccess: () => {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}

/*
 * Get confirmation to block a user.
 */
export function requestBlockUser(user) {
  return {
    type: constants.REQUEST_BLOCK_USER,
    user
  };
}

/*
 * Cancel blocking a user.
 */
export function cancelBlockUser() {
  return {
    type: constants.CANCEL_BLOCK_USER
  };
}

/*
 * Block a user.
 */
export function blockUser() {
  return (dispatch, getState) => {
    const userId = getState().block.get('userId');
    dispatch({
      type: constants.BLOCK_USER,
      payload: {
        promise: axios.post(`/api/users/${userId}/block`, {
          responseType: 'json'
        })
      },
      meta: {
        userId,
        onSuccess: () => {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}

/*
 * Get confirmation to unblock a user.
 */
export function requestUnblockUser(user) {
  return {
    type: constants.REQUEST_UNBLOCK_USER,
    user
  };
}

/*
 * Cancel unblocking a user.
 */
export function cancelUnblockUser() {
  return {
    type: constants.CANCEL_UNBLOCK_USER
  };
}

/*
 * Unblock a user.
 */
export function unblockUser() {
  return (dispatch, getState) => {
    const userId = getState().unblock.get('userId');
    dispatch({
      type: constants.UNBLOCK_USER,
      payload: {
        promise: axios.post(`/api/users/${userId}/unblock`, {
          responseType: 'json'
        })
      },
      meta: {
        userId,
        onSuccess: () => {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}
