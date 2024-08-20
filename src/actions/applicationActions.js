// import axios from 'axios';
// import {
//   APPLICATION_CREATE_REQUEST,
//   APPLICATION_CREATE_SUCCESS,
//   APPLICATION_CREATE_FAIL,
// } from '../constants/applicationConstants';

// export const createApplication = (jobId, resume, coverLetter) => async (
//   dispatch,
//   getState
// ) => {
//   try {
//     dispatch({ type: APPLICATION_CREATE_REQUEST });

//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         Authorization: `Bearer ${userInfo.token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     };

//     const formData = new FormData();
//     formData.append('resume', resume); // Add the resume file to formData
//     formData.append('coverLetter', coverLetter);

//     const { data } = await axios.post(
//       `http://localhost:5000/api/applications/${jobId}`,
//       formData,
//       config
//     );

//     dispatch({
//       type: APPLICATION_CREATE_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     dispatch({
//       type: APPLICATION_CREATE_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
import axios from 'axios';
import {
  APPLICATION_CREATE_REQUEST,
  APPLICATION_CREATE_SUCCESS,
  APPLICATION_CREATE_FAIL,
} from '../constants/applicationConstants';

// Action to create a job application
export const createApplication = (jobId, resume, coverLetter) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPLICATION_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('coverLetter', coverLetter);

    const { data } = await axios.post(
      `http://localhost:5000/api/applications/${jobId}`,
      formData,
      config
    );

    dispatch({
      type: APPLICATION_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: APPLICATION_CREATE_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};
