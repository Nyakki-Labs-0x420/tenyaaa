// Tenyaaa - IP Banning Module

let bannedUsers = JSON.parse(localStorage.getItem('tenyaaa_banned') || '[]');
let fingerprint = localStorage.getItem('tenyaaa_fingerprint');

export function getFingerprint() {
    if (!fingerprint) {
        fingerprint = 'user_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('tenyaaa_fingerprint', fingerprint);
    }
    return fingerprint;
}

export function isBanned() {
    const fp = getFingerprint();
    return bannedUsers.includes(fp);
}

export function banUser() {
    const fp = getFingerprint();
    if (!bannedUsers.includes(fp)) {
        bannedUsers.push(fp);
        localStorage.setItem('tenyaaa_banned', JSON.stringify(bannedUsers));
    }
    return true;
}