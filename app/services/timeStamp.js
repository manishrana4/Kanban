var timeStamp = () => {
  let currentdate = new Date();
  let dateTime =
    currentdate.getFullYear() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getDate() +
    "-" +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  let date = `${currentdate.getUTCFullYear()}/${
    currentdate.getUTCMonth() + 1
  }/${currentdate.getUTCDate()}-${currentdate.getUTCHours()}:${currentdate.getUTCMinutes()}`;
  
  // console.log("dateTime:", dateTime);
  // console.log("date:", date);
  // console.log("currentdate:", currentdate);

  return dateTime;
};

export default timeStamp;
