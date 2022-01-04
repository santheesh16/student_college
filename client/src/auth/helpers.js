import cookie from 'js-cookie';

// set in cookie
export const setCookie = (key, value) => {
    if (window !== 'undefined') {
        cookie.set(key, value, {
            expires: 1
        });
    }
};
// remove from cookie
export const removeCookie = key => {
    if (window !== 'undefined') {
        cookie.remove(key, {
            expires: 1
        });
    }
};
// get from cookie such as stored token
// will be useful when we need to make request to server with token
export const getCookie = key => {
    if (window !== 'undefined') {
        return cookie.get(key);
    }
};
// set in localstorage
export const setLocalStorage = (key, value) => {
    if (window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
// remove from localstorage
export const removeLocalStorage = key => {
    if (window !== 'undefined') {
        localStorage.removeItem(key);
    }
};
// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (response, next) => {
    console.log('AUTHENTICATE HELPER ON SIGNIN RESPONSE', response);
    setCookie('token', response.data.token);
    if(response.data.user){
        setLocalStorage('user', response.data.user[0]);
    } else {
        setLocalStorage('student', response.data.student[0]);
    }
    
    next();
};

export const authenticateStudent = (response, next) => {
    console.log('AUTHENTICATE HELPER ON STUDENT DATA RESPONSE', response);
    setLocalStorage('student', response.data.user);
    next();
};

export const authenticatePassword = (response, next) => {
    console.log('AUTHENTICATE HELPER ON FORGOT PASSWORD RESPONSE', response);
    setCookie('token', response.data.token);
    setLocalStorage('user', response.data.user);
    next();
};
// access user info from localstorage
export const isAuth = () => {
    if (window !== 'undefined') {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                return false;
            }
        }
    }
};

export const isStudlog = () => {
    if (window !== 'undefined') {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('student')) {
                return JSON.parse(localStorage.getItem('student'));
            } else {
                return false;
            }
        }
    }
};

export const signout = next => {
    removeCookie('token');
    removeLocalStorage('user');
    removeLocalStorage('student');
    next();
};

export const updateAdminReset = (response, next) => {
    console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
    if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user'));
        auth = response.data;
        localStorage.setItem('user', JSON.stringify(auth));
    }
    next();
};

export const updateUser = (response, next) => {
    console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
    if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('student'));
        auth = response.data;
        localStorage.setItem('user', JSON.stringify(auth));
    }
    next();
};

export const updateAdmin = (response, next) => {
    console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
    if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user'));
        auth = response.data;
        localStorage.setItem('student', JSON.stringify(auth));
    }
    next();
};

export const isStud = () => {
    if (window !== 'undefined') {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('student')) {
                return JSON.parse(localStorage.getItem('student'));
            } else {
                return false;
            }
        }
    }
};


export const deleteStud = (response,next) => {
    removeLocalStorage('student');
    next();
};
