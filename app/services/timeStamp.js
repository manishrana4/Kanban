var timeStamp= ()=>{
    let dateGenerator = new Date();
    return `${dateGenerator.getUTCFullYear()}/${dateGenerator.getUTCHours()}/${dateGenerator.getUTCDate()}-${dateGenerator.getUTCHours()}:${dateGenerator.getUTCMinutes()}`;
}

export default timeStamp;
