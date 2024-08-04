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

// Haversine formula
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


type ObjCollide = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export const isCollide = (a: ObjCollide, b: ObjCollide) => {
  return !(
    ((a.y + a.height) < (b.y)) ||
    (a.y > (b.y + b.height)) ||
    ((a.x + a.width) < b.x) ||
    (a.x > (b.x + b.width))
  );
}

// Game mode
export const enumStep = { victory: 2, fail: 3 };

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const random = (max: number) => Math.floor(Math.random() * max);
export const findRandom = (playerCenter: number[], width: number, height: number, size: number) => {
  let newX = random(width);
  let newY = random(height);
  const offset = 50;

  if (Math.abs(playerCenter[0] - newX) <= offset + size)
    newX = width - playerCenter[0];
  if (Math.abs(playerCenter[1] - newY) <= offset + size)
    newY = height - playerCenter[1];
  return [newX < 0 ? 0 : newX, newY < 0 ? 0 : newY];
}
