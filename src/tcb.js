import cloudbase from "@cloudbase/js-sdk";

// 将你的环境 Id 填写到此处
export const envId = 'lowcode-8gm18ro0fce002c9';

const app = cloudbase.init({
  env: envId,
});

const auth = app.auth({
  persistence: "local",
});

/**
 * 匿名登录
 * @return {Promise<void>}
 */
export async function tcbLogin() {
  // 1. 建议登录前先判断当前是否已经登录
  let loginState = await auth.getLoginState();
  if (!loginState) {
    // 2. 匿名登录
    await auth.anonymousAuthProvider().signIn();
    loginState = await auth.getLoginState();
    console.log('tcbLogin', loginState);
  }
}

/**
 * 注销
 * @return {Promise<void>}
 */
export function tcbLogout() {
  return auth.signOut();
}

export const getApp = () => {
  return app;
}
