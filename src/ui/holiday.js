// Tenyaaa - Holiday Detection Module

export function getHoliday() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();

    if (month === 7 && day === 4) {
        return 'Happy 4th of July! America\'s ' + (year - 1776) + 'th birthday!';
    }
    if (month === 1 && day === 1) return 'Happy New Year!';
    if (month === 12 && day === 25) return 'Merry Christmas!';
    if (month === 12 && day === 31) return 'Happy New Year\'s Eve!';
    if (month === 10 && day === 31) return 'Happy Halloween!';
    if (month === 2 && day === 14) return 'Happy Valentine\'s Day!';

    if (month === 11) {
        const fourthThursday = new Date(year, 10, 1);
        while (fourthThursday.getDay() !== 4) fourthThursday.setDate(fourthThursday.getDate() + 1);
        fourthThursday.setDate(fourthThursday.getDate() + 21);
        if (day === fourthThursday.getDate()) return 'Happy Thanksgiving!';
    }

    if (month === 4 && day >= 1 && day <= 30) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month2 = Math.floor((h + l - 7 * m + 114) / 31);
        const day2 = ((h + l - 7 * m + 114) % 31) + 1;
        if (month === month2 && day === day2) return 'Happy Easter!';
    }

    return null;
}