export const strResume = (str: string, size: number, separator: string) => {
  if (str && str.length > size)
    return str.slice(0, size / 2) + separator + str.slice(str.length - size / 2);
}

export const displayDate = (dateStr: string, withHours = false, dateObj = null) => {
  if (!dateStr && !dateObj)
    return '';
  const monthNamesFull = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const myDate = !dateObj ? new Date(dateStr) : dateObj;

  const fullDate = monthNames[myDate.getMonth()] + ' '
    + ('0' + myDate.getDate()).slice(-2) + ', ' +
    + myDate.getFullYear();

  /*const fullDate = ('0' + (myDate.getMonth() + 1)).slice(-2) + '/'
    + ('0' + myDate.getDate()).slice(-2) + '/' + 
    + myDate.getFullYear();*/
  const fullHours = ('0' + myDate.getHours()).slice(-2)
    + ':' + ('0' + myDate.getMinutes()).slice(-2)
    + ':' + ('0' + myDate.getSeconds()).slice(-2);
  return fullDate + (withHours ? ' ' + fullHours : '');
}

export const buildRequest = async (url: string, method: string, body?: any) => {
  const data = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: method !== "GET" ? JSON.stringify(body) : null,
  })
    .then((response) => response.json())
    .then((response) => {
      if (!response) throw new Error("Request Fail");
      else if (response.code) {
        throw new Error(response.message);
      }
      return response;
    });

  return data;
};

export const obj1HaveOrSupObj2 = (obj1: any, obj2: any) => {
  const keys = Object.keys(obj2);
  for (let i = 0; i < keys.length; i++)
    if (obj1[keys[i]] == undefined || obj1[keys[i]] < obj2[keys[i]])
      return false;
  return true;
}

export const unPad = (str: string) => {
  if (!str) return str;
  let i = 0;
  while (i < str.length && str[i] == '0')
    i++;
  return str.slice(i, str.length);
}

export const doPad = (str: string, size: number) => {
  if (!str) return str;
  return str.padStart(size).replaceAll(' ', '0')
}