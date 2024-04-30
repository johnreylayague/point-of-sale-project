const publicIp = require("public-ip");
const si = require("systeminformation");

const HttpError = require("../../models/http-error");

const getLocalIpAddress = async () => {
  try {
    const networkInterfaces = await si.networkInterfaces();
    const localInterface = networkInterfaces.find(
      (iface) => iface.internal === false && iface.ip4
    );
    return localInterface ? localInterface.ip4 : null;
  } catch (err) {
    console.error("Error:", err);
    const error = new Error("Failed to fetch local IP address");
    return next(error);
  }
};

const getPublicIpAddress = async () => {
  try {
    return await publicIp.v4();
  } catch (err) {
    console.error("Error:", err);
    const error = new Error("Failed to fetch Public IP address");
    return next(error);
  }
};

const getStorageSerialNumber = async () => {
  try {
    const disks = await si.diskLayout();
    if (disks && disks.length > 0) {
      // Assuming the serial number is available in the first disk
      return disks || null;
    } else {
      return null; // No disks found
    }
  } catch (err) {
    console.error("Error:", err);
    const error = new Error("Failed to fetch Storage SerialNumber");
    return next(error);
  }
};

const getMotherboardSerialNumber = async () => {
  try {
    return await si.baseboard();
  } catch (err) {
    console.error("Error:", err);
    const error = new Error("Failed to fetch Motherboard SerialNumber");
    return next(error);
  }
};

const getComputerName = async () => {
  try {
    const osInfo = await si.osInfo();
    return osInfo.hostname || null;
  } catch (err) {
    console.error("Error:", err);
    const error = new Error("Failed to fetch Computer Name");
    return next(error);
  }
};

exports.getLocalIpAddress = getLocalIpAddress;
exports.getPublicIpAddress = getPublicIpAddress;
exports.getStorageSerialNumber = getStorageSerialNumber;
exports.getMotherboardSerialNumber = getMotherboardSerialNumber;
exports.getComputerName = getComputerName;
