export function roundToFiveMinutes() {
    const currentTime = new Date();
    const minutes = currentTime.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 5) * 5; // Округляем минуты до ближайшего значения, кратного 5 и всегда большего
    currentTime.setMinutes(roundedMinutes);
    currentTime.setSeconds(0); // Обнуляем секунды, чтобы получить точное время
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
