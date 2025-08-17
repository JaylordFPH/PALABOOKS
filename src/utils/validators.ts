export const validator = <T>(...validators: Array<(value: T) => boolean>) => (value: T): boolean => {
    return validators.every(validator => validator(value));
}

export const isSafeInput = () => (str: string): boolean => !/[\[\]<>\/{}()"';:`$&|=*\\]/.test(str);
export const isLength = (min: number = 3, max: number = 50) => (str: string): boolean => str.length >= min && str.length <= max;
export const isValidEmail = (email: string): boolean => {
    if (/[<>\[\]{}"';:`$&|=*\\]/.test(email)) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
};

export const isValidPassword = (password: string): boolean => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return password.length >= 8 && password.length <= 64 &&
         hasUpper && hasLower && hasNumber && hasSpecial;
};

export const isValidInput = validator( isSafeInput(), isLength(3, 20) );
//pagination
//offset  
/*
   fetch("server.com/api/data", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        offset: 0,
        limit: 10
    })
   })
*/



