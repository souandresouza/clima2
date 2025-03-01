async function getWeather() {
    const cidade = document.getElementById('cidade').value;
    const apiKey = 'e7314838ebd86431d951d53c59e7fd20'; // Substitua com sua chave de API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
        }
        const data = await response.json();

        const icon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        const velocidadeVento = (data.wind.speed * 3.6).toFixed(2); // Convert to km/h
        const direcaoVento = data.wind.deg; // Em graus

        // Converte a direção em graus para medidas cardinais
        let direcaoCardinal = '';
        if (direcaoVento >= 337.5 || direcaoVento < 22.5) {
            direcaoCardinal = 'Norte';
        } else if (direcaoVento >= 22.5 && direcaoVento < 67.5) {
            direcaoCardinal = 'Nordeste';
        } else if (direcaoVento >= 67.5 && direcaoVento < 112.5) {
            direcaoCardinal = 'Leste';
        } else if (direcaoVento >= 112.5 && direcaoVento < 157.5) {
            direcaoCardinal = 'Sudeste';
        } else if (direcaoVento >= 157.5 && direcaoVento < 202.5) {
            direcaoCardinal = 'Sul';
        } else if (direcaoVento >= 202.5 && direcaoVento < 247.5) {
            direcaoCardinal = 'Sudoeste';
        } else if (direcaoVento >= 247.5 && direcaoVento < 292.5) {
            direcaoCardinal = 'Oeste';
        } else if (direcaoVento >= 292.5 && direcaoVento < 337.5) {
            direcaoCardinal = 'Noroeste';
        }

        document.getElementById('nome-cidade').innerText = `Clima em ${data.name}`;
        document.getElementById('temperatura').innerText = `Temperatura: ${data.main.temp}°C`;
        document.getElementById('descricao').innerText = `Descrição: ${data.weather[0].description}`;
        document.getElementById('umidade').innerText = `Umidade: ${data.main.humidity}%`;
        document.getElementById('icon-clima').src = iconUrl;

        document.getElementById('velocidade-vento').innerText = `Vento: ${velocidadeVento} km/h`;
        document.getElementById('direcao-vento').innerText = `Direção: ${direcaoCardinal}`;

        // Fetch 5-day forecast
        await getForecast(cidade, apiKey);

        // Salve a cidade no localStorage
        localStorage.setItem('ultimaCidade', cidade);
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
        alert(error.message || 'Não foi possível obter os dados climáticos. Verifique sua conexão ou tente novamente.');
    }
}

async function getForecast(cidade, apiKey) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar previsão do tempo.');
        }
        const forecastData = await response.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('Erro ao buscar previsão do tempo:', error);
    }
}

function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Display forecast for 4 days
    for (let i = 0; i < 4 * 8; i += 8) { // 8 intervals per day, 4 days total
        const dayData = forecastData.list[i];
        const date = new Date(dayData.dt_txt).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
        const temp = dayData.main.temp;
        const description = dayData.weather[0].description;
        const icon = dayData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <h3>${date}</h3>
            <img src="${iconUrl}" alt="${description}">
            <p>Temp: ${temp}°C</p>
            <p>${description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}

// Carregue a cidade salva ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    const ultimaCidade = localStorage.getItem('ultimaCidade');
    if (ultimaCidade) {
        document.getElementById('cidade').value = ultimaCidade;
        getWeather(ultimaCidade);
    }
});

// Adicione um evento ao botão para buscar o clima
document.getElementById('buscar-clima').addEventListener('click', getWeather);
