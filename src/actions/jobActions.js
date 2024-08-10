// src/actions/jobActions.js
import axios from 'axios';
import {
  JOB_LIST_REQUEST,
  JOB_LIST_SUCCESS,
  JOB_LIST_FAIL,
  JOB_DETAILS_REQUEST,
  JOB_DETAILS_SUCCESS,
  JOB_DETAILS_FAIL,
  JOB_UPDATE_REQUEST,
  JOB_UPDATE_SUCCESS,
  JOB_UPDATE_FAIL,
} from '../constants/jobConstants';

export const listJobs = () => async (dispatch) => {
  try {
    dispatch({ type: JOB_LIST_REQUEST });

    const { data } = await axios.get('/api/jobs');

    dispatch({
      type: JOB_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: JOB_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listJobDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: JOB_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/jobs/${id}`);

    dispatch({
      type: JOB_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: JOB_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateJob = (job) => async (dispatch, getState) => {
  try {
    dispatch({
      type: JOB_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/jobs/${job._id}`, job, config);

    dispatch({
      type: JOB_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: JOB_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
