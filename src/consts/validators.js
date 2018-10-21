// !!important
// 所有自訂驗證器都需要對空字串進行處理
export function validatePhoneNumber(value) {
  if (value === '') {
    return true;
  }
  const re = /^1[3|4|5|7|8|][0-9]{9}$/;
  return re.test(value);
}

export function validateRealName(value) {
  if (value === '') {
    return true;
  }
  const re = /^[\u4e00-\u9fa5|.]+$/;
  return re.test(value);
}

export function validateEngNumUnderline(value) {
  if (value === '') {
    return true;
  }
  const re = /^[A-Za-z0-9|_|]+$/;
  return re.test(value);
}

// 验证邮箱
export function checkEmail(value) {
  if (value === '') {
    return true;
  }
  const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
  return re.test(value);
}

// 验证微信
export function checkWechat(value) {
  if (value === '') {
    return true;
  }
  // const re = /^[a-zA-Z\d_\-@]{5,30}$/;
  const re = /^[\w\-@]{2,30}$/;
  return re.test(value);
}

// 验证qq
export function checkqq(value) {
  if (value === '') {
    return true;
  }
  const re = /^[1-9][0-9]{4,20}$/;
  return re.test(value);
}

// 验证開戶行
export function validateBankDeposit(value) {
  if (value === '') {
    return true;
  }
  const re = /[\u4e00-\u9fa5]/;
  return re.test(value);
}

/**
 * @name 驗證是否必填
 * @param {*} type 規則是否必填
 * @param {*} value 驗證值
 */
export function checkRequired(type, value) {
  if (type) {
    if (!value) {
      return false;
    }
  }
  return true;
}
