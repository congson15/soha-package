import { axiosServices } from '../axios';
import CheerioHelper from './cheerio';

class SoHaHelper {
  private _viewState: string;
  private cookie: string;
  private cheerioHelper: CheerioHelper = new CheerioHelper();
  private username: string;
  private password: string;

  constructor() {
    this._viewState = '';
    this.cookie = '';
    this.username = '';
    this.password = '';
  }

  private parseCookieFromHeaders(headers: any): string | undefined {
    const cookieHeader = headers['set-cookie'];
    if (cookieHeader && Array.isArray(cookieHeader)) {
      const regex = /ASP\.NET_SessionId=(.*?);/g;
      const cookieMatch = regex.exec(cookieHeader[0]);
      if (cookieMatch) {
        return cookieMatch[1];
      }
    }
    return undefined;
  }

  private parseViewStateFromBody(body: string): string | undefined {
    this.cheerioHelper.setHTML(body);
    return this.cheerioHelper.getAttributeValue('#__VIEWSTATE', 'val');
  }

  public async getCookieAndViewState(): Promise<void> {
    try {
      const result = await axiosServices.get('/');
      this.cookie = this.parseCookieFromHeaders(result.headers) as string;
      this._viewState = this.parseViewStateFromBody(result.data as string) as string;
    } catch (error) {
      console.log(error);
    }
  }

  public async loginWithUserAndPassword(user: string, password: string): Promise<string | undefined> {
    try {
      await this.getCookieAndViewState();

      const formData = {
        __VIEWSTATE: this._viewState,
        ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: user,
        ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: password,
        ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: 'Đăng Nhập',
      };
      console.log(this.cookie);
      const headers = {
        Cookie: `ASP.NET_SessionId=${this.cookie}`,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36',
      };

      const response = await axiosServices.post(`/default.aspx`, formData, headers);
      this.cheerioHelper.setHTML(response.data as string);
      // const fullName = this.cheerioHelper.getElementText('#ctl00_Header1_Logout1_lblNguoiDung');
      // const isLogin = this.cheerioHelper.getElementText('#ctl00_menu_lblThayDoiTTCN');
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }
}

export default SoHaHelper;
