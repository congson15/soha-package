const SGU_PARAMS = {
  X_AJAXPRO_METHOD: 'X-AjaxPro-Method',
  COOKIE_PREFIX: `ASP.NET_SessionId=`,
  __VIEWSTATE: '__VIEWSTATE',
  LOC_THEO_MON_HOC: 'LocTheoMonHoc',
};

const HTML_DOM_PARAMS = {
  USERNAME: 'ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa',
  PASSWORD: 'ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau',
  LOGIN: 'ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap',
  FULLNAME: 'ctl00_Header1_Logout1_lblNguoiDung',
  CHANGE_INFORMATION: 'ctl00_ContentPlaceHolder1_ctl00_lblTieuDe',
  TTCN: 'ctl00_menu_lblThayDoiTTCN',
};

const TABLE_DOM_PARAMS = {
  id: 'td:nth-child(1) input',
  maMon: 'td:nth-child(2)',
  tenMon: 'td:nth-child(3)',
  maNhom: 'td:nth-child(4)',
  maTTH: 'td:nth-child(5)',
  soTC: 'td:nth-child(6)',
  siSo: 'td:nth-child(9)',
  conLai: 'td:nth-child(10)',
  thu: 'td:nth-child(12)',
  tietBatDau: 'td:nth-child(13)',
  soTiet: 'td:nth-child(14)',
  phongHoc: 'td:nth-child(15)',
  giangVien: 'td:nth-child(16)',
};

export { SGU_PARAMS, TABLE_DOM_PARAMS, HTML_DOM_PARAMS };
