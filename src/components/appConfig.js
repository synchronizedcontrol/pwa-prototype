/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

const link = () => {
  switch (window.location.href.indexOf('localhost') > -1) {
    case true:
      return 'http://localhost:38343/';
    default:
      return 'https://lcs3.agsplus.nl/api/';
  }
};

export const authUrl = `${link()}auth/login`;
export const translatorUrl = `${link()}translation-requests/`;
export const fileUploadUrl = `${link()}application-info/file-upload`;
export const profileUrl = `${link()}portal/users/me`;
export const dashboardUrl = `${link()}ags/declarations/code/A`;
export const defaultDeclarationUrl = `/default.json`;
export const sponqDefaultDeclarationUrl = `/sponqDefault.json`;
