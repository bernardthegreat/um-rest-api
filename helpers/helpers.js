function getIp(remoteAddress) {
    let ip = remoteAddress.split(':');
    ip = ip[ip.length - 1];
    return ip;
}

module.exports = {
    getIp:getIp,
}