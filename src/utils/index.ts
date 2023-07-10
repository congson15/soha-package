import { RawAxiosRequestHeaders } from 'axios';
import { COOKIE_REGEX, TABLE_REGEX } from '../constants';

interface IGetLoginFormData {
  username: string;
  password: string;
}
export const getLoginFormData = ({ username, password }: IGetLoginFormData) => {
  return {
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: username,
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: password,
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: 'Đăng Nhập',
  };
};

export const getHeaders = (cookie: string) => {
  return {
    Cookie: `ASP.NET_SessionId=${cookie}`,
    'Content-Type': 'multipart/form-data, application/json',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36',
  };
};

export const parseCookieFromHeaders = (headers: RawAxiosRequestHeaders): string => {
  const cookieHeader = headers['set-cookie'];
  if (cookieHeader && Array.isArray(cookieHeader)) {
    const cookieMatch = COOKIE_REGEX.exec(cookieHeader[0]);
    if (cookieMatch) {
      return cookieMatch[1];
    }
  }
  return '';
};

const removeSpecialCharacters = (text: string): string => {
  return text
    .replace(/\&nbsp;/g, '')
    .replace(/\\r/g, '')
    .replace(/\\n/g, '')
    .replace(/\\/g, '');
};

const removeEmptyDivTags = (text: string): string => {
  return text.replace(TABLE_REGEX, '');
};

export const transformTableElement = (tableElm: string) => {
  let transformedText = removeSpecialCharacters(tableElm);
  transformedText = removeEmptyDivTags(transformedText);
  return transformedText;
};
