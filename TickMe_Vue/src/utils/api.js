import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:3000', // 设置默认请求地址
  timeout: 5000, // 设置默认超时时间
  headers: {
    'Content-Type': 'application/json', // 设置默认请求头
  },
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在请求发出之前做一些处理，比如设置请求头信息
    // config.headers['Authorization'] = getToken();
    return config;
  },
  (error) => {
    // 请求出错时处理错误信息
    console.error(error);
    return Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 可以在响应收到之后做一些处理，比如对响应数据进行格式化
    return response;
  },
  (error) => {
    // 响应出错时处理错误信息
    console.error(error);
    return Promise.reject(error);
  }
);

export default service;