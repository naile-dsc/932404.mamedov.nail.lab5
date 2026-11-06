document.addEventListener("DOMContentLoaded", function () {
    // 1. Поиск элементов по ID
    function getEl(id) {
        return document.getElementById(id);
    }

    // 2. Логика расчёта метрик (ЛР №4)
    var USER_NAME_KEY = "startup_user_name_v16";
    var savedName = null;

    try {
        savedName = localStorage.getItem(USER_NAME_KEY);
    } catch (e) {
        console.error("Ошибка localStorage:", e);
    }

    if (!savedName) {
        var inputName = prompt("Введите ваше имя предпринимателя:");
        savedName = (inputName && inputName.trim() !== "") ? inputName.trim() : "Гость";
        try {
            localStorage.setItem(USER_NAME_KEY, savedName);
        } catch (e) {}
    }

    var welcomeEl = getEl("welcome-message");
    if (welcomeEl) {
        welcomeEl.textContent = "Добро пожаловать, " + savedName + "!";
    }

    var revenues = [12000, 2500, 15000, 2800, 9000, 11000, 4000];

    function getSum(arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    function getMax(arr) {
        var max = arr[0];
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }

    var totalRevenue = getSum(revenues);
    var maxRevenue = getMax(revenues);
    var averageRevenue = totalRevenue / revenues.length;

    var lowDaysCount = 0;
    for (var i = 0; i < revenues.length; i++) {
        if (revenues[i] <= 3000) {
            lowDaysCount++;
        }
    }
    var lowDaysShare = (lowDaysCount / revenues.length) * 100;

    var totalRevEl = getEl("total-revenue");
    var maxRevEl = getEl("max-revenue");
    var avgRevEl = getEl("avg-revenue");
    var lowDaysEl = getEl("low-days");
    var lowDaysShareEl = getEl("low-days-share");

    if (totalRevEl) totalRevEl.textContent = totalRevenue + " ₽";
    if (maxRevEl) maxRevEl.textContent = maxRevenue + " ₽";
    if (avgRevEl) avgRevEl.textContent = averageRevenue.toFixed(2) + " ₽";
    if (lowDaysEl) lowDaysEl.textContent = String(lowDaysCount);
    if (lowDaysShareEl) lowDaysShareEl.textContent = lowDaysShare.toFixed(2);

    // 3. Переключение темы (ЛР №5)
    var THEME_KEY = "startup_theme_v16";
    var themeToggleBtn = getEl("theme-toggle-btn");

    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
        if (themeToggleBtn) {
            themeToggleBtn.textContent = isDark ? "Светлая тема" : "Тёмная тема";
            themeToggleBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
        }
    }

    var isDarkTheme = false;
    try {
        isDarkTheme = (localStorage.getItem(THEME_KEY) === "dark");
    } catch (e) {}
    applyTheme(isDarkTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            var currentIsDark = document.body.classList.contains("dark-theme");
            var nextThemeState = !currentIsDark;
            applyTheme(nextThemeState);
            try {
                localStorage.setItem(THEME_KEY, nextThemeState ? "dark" : "light");
            } catch (e) {
                console.error("Ошибка сохранения темы:", e);
            }
        });
    }

    // 4. Карточки идей (ЛР №5, Вариант 16)
    var IDEAS_KEY = "startup_ideas_v16";
    var ideasContainer = getEl("ideas-container");
    var ideasHeading = document.querySelector("#ideas h2");

    var addIdeaBtn = getEl("add-idea-btn");
    var removeLastBtn = getEl("remove-last-btn");
    var toggleIdeasBtn = getEl("toggle-ideas-btn");

    var titleInput = getEl("idea-title-input");
    var audienceInput = getEl("idea-audience-input");
    var metricInput = getEl("idea-metric-input");

    var defaultIdeas = [
        { id: "idea-1", title: "EcoDelivery", audience: "Кафе и рестораны", metric: "CAC: 35 $" },
        { id: "idea-2", title: "SmartInventory", audience: "Складской бизнес", metric: "LTV: 620 $" },
        { id: "idea-3", title: "LocalConnect", audience: "B2B поставщики", metric: "MAU: 4 200" },
        { id: "idea-4", title: "SkillSwap", audience: "Фрилансеры", metric: "Конверсия: 18%" }
    ];

    function loadIdeas() {
        try {
            var data = localStorage.getItem(IDEAS_KEY);
            if (data) {
                var parsed = JSON.parse(data);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Ошибка парсинга идей:", e);
        }
        return defaultIdeas.slice();
    }

    function saveIdeas(arr) {
        try {
            localStorage.setItem(IDEAS_KEY, JSON.stringify(arr));
        } catch (e) {
            console.error("Ошибка сохранения идей:", e);
        }
    }

    var ideasList = loadIdeas();

    function updateCounter() {
        if (!ideasHeading) return;
        var count = document.querySelectorAll("#ideas-container .idea-card").length;
        ideasHeading.textContent = "Идеи стартапов (" + count + ")";
    }

    function createCardNode(idea) {
        var card = document.createElement("article");
        card.className = "idea-card";
        card.setAttribute("data-id", idea.id);

        var content = document.createElement("div");

        var h3 = document.createElement("h3");
        h3.textContent = idea.title;

        var pAudience = document.createElement("p");
        var strongAudience = document.createElement("strong");
        strongAudience.textContent = "Целевая аудитория: ";
        pAudience.appendChild(strongAudience);
        pAudience.appendChild(document.createTextNode(idea.audience));

        var pMetric = document.createElement("p");
        var strongMetric = document.createElement("strong");
        strongMetric.textContent = "Метрика: ";
        pMetric.appendChild(strongMetric);
        pMetric.appendChild(document.createTextNode(idea.metric));

        content.appendChild(h3);
        content.appendChild(pAudience);
        content.appendChild(pMetric);

        var delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "delete-card-btn";
        delBtn.textContent = "Удалить";

        delBtn.addEventListener("click", function () {
            var filtered = [];
            for (var i = 0; i < ideasList.length; i++) {
                if (ideasList[i].id !== idea.id) {
                    filtered.push(ideasList[i]);
                }
            }
            ideasList = filtered;
            saveIdeas(ideasList);
            card.remove();
            updateCounter();
        });

        card.appendChild(content);
        card.appendChild(delBtn);
        return card;
    }

    function renderAllIdeas() {
        if (!ideasContainer) return;
        ideasContainer.innerHTML = "";
        for (var i = 0; i < ideasList.length; i++) {
            ideasContainer.appendChild(createCardNode(ideasList[i]));
        }
        updateCounter();
    }

    renderAllIdeas();

    // Добавление новой идеи
    if (addIdeaBtn) {
        addIdeaBtn.addEventListener("click", function () {
            if (!ideasContainer) return;

            var titleVal = titleInput ? titleInput.value.trim() : "";
            var audienceVal = audienceInput ? audienceInput.value.trim() : "";
            var metricVal = metricInput ? metricInput.value.trim() : "";

            var newIdea = {
                id: "idea-" + Date.now(),
                title: titleVal !== "" ? titleVal : ("Новый стартап #" + (ideasList.length + 1)),
                audience: audienceVal !== "" ? audienceVal : "Широкая аудитория",
                metric: metricVal !== "" ? metricVal : "LTV > 500$"
            };

            ideasList.push(newIdea);
            saveIdeas(ideasList);
            ideasContainer.appendChild(createCardNode(newIdea));
            updateCounter();

            if (titleInput) titleInput.value = "";
            if (audienceInput) audienceInput.value = "";
            if (metricInput) metricInput.value = "";
        });
    }

    // Удаление последней идеи
    if (removeLastBtn) {
        removeLastBtn.addEventListener("click", function () {
            if (!ideasContainer || ideasList.length === 0) return;

            var cards = document.querySelectorAll("#ideas-container .idea-card");
            if (cards.length > 0) {
                cards[cards.length - 1].remove();
                ideasList.pop();
                saveIdeas(ideasList);
                updateCounter();
            }
        });
    }

    // Скрытие / показ блока
    if (toggleIdeasBtn) {
        toggleIdeasBtn.addEventListener("click", function () {
            if (!ideasContainer) return;
            var isHidden = ideasContainer.classList.toggle("hidden");
            toggleIdeasBtn.textContent = isHidden ? "Показать идеи" : "Скрыть идеи";
            toggleIdeasBtn.setAttribute("aria-expanded", isHidden ? "false" : "true");
        });
    }
});