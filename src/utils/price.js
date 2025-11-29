// utils/price.js
export function calculatePrice(startTime, endTime) {
  const durationMinutes = (new Date(endTime) - new Date(startTime)) / 60000;
  const day = new Date(startTime).getDay();
  const isWeekend = day === 0 || day === 6;

  if (!isWeekend) {
    if (durationMinutes <= 30) return 100;
    if (durationMinutes <= 60) return 200;
    if (durationMinutes <= 90) return 270;
    if (durationMinutes <= 120) return 350;
    return 500;
  } else {
    if (durationMinutes <= 30) return 150;
    if (durationMinutes <= 60) return 300;
    if (durationMinutes <= 90) return 400;
    if (durationMinutes <= 120) return 500;
    return 700;
  }
}
