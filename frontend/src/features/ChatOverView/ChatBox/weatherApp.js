import { sendMessage } from "app/actions/chat";
import { updateListConversationWithSentMessage } from "app/actions/conversations";

export function getWeatherNextFewDay(navigator, dispatch, socket, roomId) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const rs = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily&appid=3a732a3691d14d659946b17bb1939688`
        );
        const data = await rs.json();
        // console.log(data)
        var object = [];
        const hourly = data.hourly;
        var listDate = [];
        for (let i = 0; i < hourly.length; i++) {
            const date = new Date(data?.hourly[i]?.dt * 1000)
                .toLocaleString('vi-VN', {
                    timeZone: 'Asia/Ho_Chi_Minh',
                })
                .split(',')[1];
            let contain = false;
            for (let j in listDate) {
                if (listDate[j]?.includes(date)) contain = true;
            }
            if (!contain) listDate.push(date);
            contain = false;
        }
        const listHour = ['07', '10', '13', '17', '20'];
        // var message = 'Weather for next few days: \n';
        for (let index in listDate) {
            // message += `- Date:${listDate[index]}\n`;
            var DateData = {};
            DateData.date = listDate[index];
            var status = [];
            for (let i = 0; i < hourly.length; i++) {
                const date = new Date(data?.hourly[i]?.dt * 1000).toLocaleString(
                    'vi-VN',
                    {
                        timeZone: 'Asia/Ho_Chi_Minh',
                    }
                );
                let hour = date.split(',')[0].substring(0, 2);
                if (
                    listDate[index] === date.split(',')[1] &&
                    listHour.includes(hour)
                ) {
                    let description = data?.hourly[i]?.weather[0]?.description;
                    let dayTimedisplay =
                        date.split(',')[0].substring(0, 5) + date.split(',')[1];
                    let temp = (hourly[i].temp / 10).toFixed(0);
                    let feellike = (hourly[i].feels_like / 10).toFixed(0);
                    let humidity = hourly[i].humidity / 100;
                    let uv = hourly[i].uvi;
                    let icon = hourly[i].weather[0].icon;
                    DateData.weather = description;
                    let statusTemp = { time: dayTimedisplay, temp, feellike, humidity, uv };
                    status.push(statusTemp);
                    // message += `  • ${dayTimedisplay}:\n\tWeather:${description} \n\t ◦ Current Temperature/Feels like:  ${temp}°C/${feellike}°C \n\t ◦ Humidity: ${humidity}%\n\t ◦ UV: ${UV}\n`;
                }
            }
            DateData.status = { status };
            object.push(DateData);
        }
        socket?.emit(
            'chat message',
            JSON.stringify(object),
            8,
            roomId,
            null,
            (status, data) => {
                if (status === 'ok' && +data.ToAccount === +roomId) {
                    dispatch(sendMessage(data));
                    dispatch(updateListConversationWithSentMessage(data, 8));
                }
            }
        );
    });
}