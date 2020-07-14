import axios from 'axios';
import config from '../../config'

const mernApi = axios.create();

// Set your own baseURL
mernApi.defaults.baseURL = config.serverUrl;

mernApi.setAuthToken = (jwtToken) => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export default mernApi;
