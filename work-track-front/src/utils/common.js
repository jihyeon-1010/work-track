// 이메일 유효성 검사
export const validateEmail = email => {
    const regex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
};

// 비밀번호 유효성 검사
export const validatePassword = password => {
    // 최소 8~16자까지
    // 최소 하나 이상의 영문자 (소문자 or 대문자)
    // 최소 하나 이상의 숫자
    // 최소 하하 이상의 특수문자
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
    return regex.test(password);
}

// 문자열 공백 제거 
export const removeWhitespace = text => {
    const regex = /\s/g;
    return text.replace(regex, '');
};

export const getDateOrTime = ts => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
};
