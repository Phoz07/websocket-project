const currentTime = new Date();

// 1. เวลาเริ่มต้น (วันนี้ 13:00 น.)
const startTime = new Date(currentTime);
startTime.setHours(13, 0, 0, 0);

// 2. เวลาสิ้นสุด (วันนี้ 16:00 น.)
const endTime = new Date(currentTime);
endTime.setHours(16, 0, 0, 0);

// แสดงผลตรวจสอบค่าใน Console
console.log("Start:", startTime);
console.log("End:", endTime);
