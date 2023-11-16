import axios from "axios";

async function postRequestHandler (endpoint, data){
  try {
    const response = await axios.post(
      endpoint,
      {
        data: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

async function getRequestHandler (endpoint, config){
  try {
    const response = await axios.get(endpoint, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {postRequestHandler, getRequestHandler};
