export const validator = <T>(...validators: Array<(value: T) => boolean>) => (value: T): boolean => {
    return validators.every(validator => validator(value));
}


export const isSafeInput = () => (str: string): boolean => !/[\[\]<>\/{}()"';:`$&|=*\\]/.test(str);
export const isLength = (min: number = 3, max: number = 20) => (str: string): boolean => str.length >= min && str.length <= max;
export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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



