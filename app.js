
function parseTime(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') {
        console.error('parseTime получил неверный параметр:', timeStr);
        return {
            startMinutes: 0,
            endMinutes: 0,
            start: '00:00',
            end: '00:00'
        };
    }
    
    const [start, end] = timeStr.split('-');
    if (!start || !end) {
        console.error('parseTime не может разобрать время:', timeStr);
        return {
            startMinutes: 0,
            endMinutes: 0,
            start: '00:00',
            end: '00:00'
        };
    }
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    return {
        startMinutes: startHour * 60 + startMin,
        endMinutes: endHour * 60 + endMin,
        start: start,
        end: end
    };
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
        return `${mins}м`;
    } else if (mins === 0) {
        return `${hours}ч`;
    } else {
        return `${hours}ч ${mins}м`;
    }
}

function computeGaps(lessons, minGapMinutes = 10) {
    if (!lessons || lessons.length <= 1) return [];
    
    const gaps = [];
    const sortedLessons = [...lessons].sort((a, b) => {
        const aTime = parseTime(a.time);
        const bTime = parseTime(b.time);
        return aTime.startMinutes - bTime.startMinutes;
    });
    
    for (let i = 0; i < sortedLessons.length - 1; i++) {
        const current = parseTime(sortedLessons[i].time);
        const next = parseTime(sortedLessons[i + 1].time);
        
        const gapMinutes = next.startMinutes - current.endMinutes;
        
        if (gapMinutes >= minGapMinutes) {
            const gap = {
                gap: true,
                durationMinutes: gapMinutes,
                start: current.end,
                end: next.start,
                pretty: formatDuration(gapMinutes),
                isLongGap: gapMinutes >= 60
            };
            gaps.push(gap);
        }
    }
    
    return gaps;
}

function mergeLessonsWithGaps(lessons, gaps, showGaps = true) {
    if (!showGaps || gaps.length === 0) return lessons;
    
    const result = [];
    const sortedLessons = [...lessons].sort((a, b) => {
        const aTime = parseTime(a.time);
        const bTime = parseTime(b.time);
        return aTime.startMinutes - bTime.startMinutes;
    });
    
    let gapIndex = 0;
    
    for (let i = 0; i < sortedLessons.length; i++) {
        result.push(sortedLessons[i]);
        
        if (gapIndex < gaps.length) {
            const current = parseTime(sortedLessons[i].time);
            const gap = gaps[gapIndex];
            
            if (gap.start === current.end) {
                result.push(gap);
                gapIndex++;
            }
        }
    }
    
    return result;
}
const scheduleCIE2501 = {
    "Monday": [
      { "time": "9:30-10:30", "course": "P1", "teacher": "F.Atamurotov", "room": "A805", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "u.safarov@iut.uz" },
      { "gap": true, "start": "12:30", "end": "15:30", "duration": "3h" },
      { "time": "15:30-17:00", "course": "PE1", "teacher": "F.Atamurotov", "room": "A502/A504", "email": "" }
    ],
    "Tuesday": [
      { "time": "14:00-15:30", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B102 PC Lab", "email": "sh.suvanov@iut.uz" },
      { "time": "15:30-17:00", "course": "AE1", "teacher": "U.Baydullaeva", "room": "A705", "email": "u.ubaydullaeva@iut.uz" }
    ],
    "Wednesday": [
      { "time": "9:30-10:30", "course": "AE1", "teacher": "U.Baydullaeva", "room": "A513", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "P1", "teacher": "F.Atamurotov", "room": "A606", "email": "" }
    ],
    "Thursday": [
      { "time": "9:30-10:30", "course": "CAL1", "teacher": "U.Safarov", "room": "A203", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B103 PC Lab", "email": "" },
      { "gap": true, "start": "12:30", "end": "15:30", "duration": "3h" },
      { "time": "15:30-17:00", "course": "AER", "teacher": "U.Baydullaeva", "room": "A706", "email": "" }
    ],
    "Friday": []
  };
  const scheduleCIE2502 = {
    "Monday": [
      { "time": "9:30-10:30", "course": "P1", "teacher": "F.Atamurotov", "room": "A805", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "u.safarov@iut.uz" },
      { "gap": true, "start": "12:30", "end": "15:30", "duration": "3h" },
      { "time": "15:30-17:00", "course": "AER", "teacher": "U.Baydullaeva", "room": "A708", "email": "" }
    ],
    "Tuesday": [
      { "time": "9:30-10:30", "course": "AE1", "teacher": "U.Baydullaeva", "room": "A614", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B102 PC Lab", "email": "sh.suvanov@iut.uz" }
    ],
    "Wednesday": [
      { "time": "9:30-10:30", "course": "AE1", "teacher": "U.Baydullaeva", "room": "A614", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "P1", "teacher": "F.Atamurotov", "room": "A606", "email": "" },
      { "gap": true, "start": "12:30", "end": "14:00", "duration": "1h 30m" },
      { "time": "14:00-15:30", "course": "PE1", "teacher": "F.Atamurotov", "room": "A502/A504", "email": "" }
    ],
    "Thursday": [
      { "time": "9:30-10:30", "course": "CAL1", "teacher": "U.Safarov", "room": "A203", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B103 PC Lab", "email": "" }
    ],
    "Friday": []
  };
  
const scheduleCIE2503 = {
  "Monday": [
    { "time": "11:00-12:30", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "u.safarov@iut.uz" },
    { "time": "12:30-14:00", "course": "AE1", "teacher": "U.Ubaydullaeva", "room": "A708", "email": "u.ubaydullaeva@iut.uz" },
    { "gap": true, "start": "14:00", "end": "15:30", "duration": "1h 30m" },
    { "time": "15:30-17:00", "course": "P1", "teacher": "F.Atamurotov", "room": "A605", "email": "f.atamurotov@iut.uz" }
  ],
  "Tuesday": [
    { "time": "9:30-11:00", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B102 PC Lab", "email": "sh.suvanov@iut.uz" },
    { "time": "11:00-12:30", "course": "AER", "teacher": "A.Khalilova", "room": "A705", "email": "a.khalilova@iut.uz" }
  ],
  "Wednesday": [
    { "time": "9:30-11:00", "course": "P1", "teacher": "F.Atamurotov", "room": "A607", "email": "f.atamurotov@iut.uz" },
    { "gap": true, "start": "11:00", "end": "12:30", "duration": "1h 30m" },
    { "time": "12:30-14:00", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B102 PC Lab", "email": "sh.suvanov@iut.uz" },
    { "time": "14:00-15:30", "course": "AE1", "teacher": "U.Ubaydullaeva", "room": "A705", "email": "u.ubaydullaeva@iut.uz" }
  ],
  "Thursday": [
    { "time": "9:30-11:00", "course": "CAL1", "teacher": "U.Safarov", "room": "A203", "email": "u.safarov@iut.uz" },
    { "gap": true, "start": "11:00", "end": "11:30", "duration": "30m" },
    { "time": "11:30-13:00", "course": "PE1", "teacher": "F.Atamurotov", "room": "A502/A504", "email": "f.atamurotov@iut.uz" }
  ],
  "Friday": []
};

const scheduleCIE2504 = {
  "Monday": [
    { "time": "9:30-11:00", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "u.safarov@iut.uz" },
    { "gap": true, "start": "11:00", "end": "12:30", "duration": "1h 30m" },
    { "time": "12:30-14:00", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "u.safarov@iut.uz" },
    { "gap": true, "start": "14:00", "end": "15:30", "duration": "1h 30m" },
    { "time": "15:30-17:00", "course": "P1", "teacher": "F.Atamurotov", "room": "A605", "email": "f.atamurotov@iut.uz" }
  ],
  "Tuesday": [
    { "time": "9:30-11:00", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B102 PC Lab", "email": "sh.suvanov@iut.uz" },
    { "gap": true, "start": "11:00", "end": "12:30", "duration": "1h 30m" },
    { "time": "12:30-14:00", "course": "AE1", "teacher": "U.Ubaydullaeva", "room": "A706", "email": "u.ubaydullaeva@iut.uz" }
  ],
  "Wednesday": [
    { "time": "9:30-11:00", "course": "P1", "teacher": "F.Atamurotov", "room": "A607", "email": "f.atamurotov@iut.uz" },
    { "gap": true, "start": "11:00", "end": "12:30", "duration": "1h 30m" },
    { "time": "12:30-14:00", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B102 PC Lab", "email": "sh.suvanov@iut.uz" }
  ],
  "Thursday": [
    { "time": "11:00-12:30", "course": "AE1", "teacher": "U.Ubaydullaeva", "room": "A705", "email": "u.ubaydullaeva@iut.uz" },
    { "time": "12:30-14:00", "course": "AER", "teacher": "A.Khalilova", "room": "A706", "email": "a.khalilova@iut.uz" },
    { "gap": true, "start": "14:00", "end": "16:00", "duration": "2h" },
    { "time": "16:00-18:00", "course": "PE1", "teacher": "F.Atamurotov", "room": "A502/A504", "email": "f.atamurotov@iut.uz" }
  ],
  "Friday": []
};

const scheduleCIE2505 = {
    "Monday": [
      { "time": "9:30-10:30", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "" },
      { "gap": true, "start": "12:30", "end": "15:30", "duration": "3h" },
      { "time": "15:30-17:00", "course": "AE1", "teacher": "A.Khalilova", "room": "A513", "email": "" }
    ],
    "Tuesday": [
      { "time": "9:30-10:30", "course": "P1", "teacher": "F.Atamurotov", "room": "A605", "email": "" }
    ],
    "Wednesday": [
      { "gap": true, "start": "9:30", "end": "11:00", "duration": "1h 30m" },
      { "time": "11:00-12:30", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B102 PC Lab", "email": "" },
      { "gap": true, "start": "12:30", "end": "14:00", "duration": "1h 30m" },
      { "time": "14:00-15:30", "course": "AER", "teacher": "R.Neyaskulova", "room": "A513", "email": "" },
      { "time": "15:30-17:00", "course": "PE1", "teacher": "F.Atamurotov", "room": "A502/A504", "email": "" }
    ],
    "Thursday": [
      { "time": "9:30-10:30", "course": "P1", "teacher": "F.Atamurotov", "room": "A605", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B103 PC Lab", "email": "" }
    ],
    "Friday": [
      { "time": "9:30-10:30", "course": "AE1", "teacher": "A.Khalilova", "room": "A705", "email": "" }
    ]
  };
  

  const scheduleCIE2506 = {
    "Monday": [
      { "time": "9:30-10:30", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "AE1", "teacher": "A.Khalilova", "room": "A407", "email": "" },
      { "gap": true, "start": "12:30", "end": "15:30", "duration": "3h" },
      { "time": "15:30-17:00", "course": "CAL1", "teacher": "U.Safarov", "room": "B210", "email": "" }
    ],
    "Tuesday": [
      { "time": "9:30-10:30", "course": "P1", "teacher": "F.Atamurotov", "room": "A805", "email": "" }
    ],
    "Wednesday": [
      { "time": "11:00-12:30", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B102 PC Lab", "email": "" }
    ],
    "Thursday": [
      { "time": "9:30-10:30", "course": "P1", "teacher": "F.Atamurotov", "room": "A805", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "AER", "teacher": "R.Neyaskulova", "room": "A607", "email": "" },
      { "gap": true, "start": "12:30", "end": "14:00", "duration": "1h 30m" },
      { "time": "14:00-15:30", "course": "OOP1", "teacher": "Sh.Suvanov", "room": "B103 PC Lab", "email": "" }
    ],
    "Friday": [
      { "time": "9:30-10:30", "course": "PE1", "teacher": "F.Sariqulov", "room": "A502/A504", "email": "" },
      { "gap": true, "start": "10:30", "end": "11:00", "duration": "30m" },
      { "time": "11:00-12:30", "course": "AE1", "teacher": "A.Khalilova", "room": "A705", "email": "" }
    ]
  };
  

const schedules = {
    // 'CIE2501': scheduleCIE2501,
    // 'CIE2502': scheduleCIE2502,
    'CIE2503': scheduleCIE2503,
    'CIE2504': scheduleCIE2504,
    // 'CIE2505': scheduleCIE2505,
    // 'CIE2506': scheduleCIE2506
};

// Словарь терминов AER (Academic English Reading)
const homeworkDictionary = {
    "AER": {
        "Ties": "Связи — отношения или связи с человеком или местом",
        "Nurture": "Воспитывать — помогать кому-то или чему-то развиваться",
        "Acquaintance": "Знакомый — человек, которого вы знаете немного, который не является близким другом",
        "Hyper-connected": "Гиперсвязанный — всегда связанный с людьми через технологии",
        "Narcissists": "Нарциссы — люди, которые слишком много восхищаются собой",
        "Adolescents": "Подростки — дети, которые превращаются в молодых взрослых",
        "Anti-social": "Асоциальный — проявляющий недостаток заботы о других или обществе в целом",
        "Empathy": "Эмпатия — способность понимать или представлять, как кто-то чувствует",
        "Emissions": "Выбросы — газы, выбрасываемые в воздух",
        "Renewable": "Возобновляемый — то, что может быть заменено естественным образом и использовано снова",
        "Initiative": "Инициатива — новое действие или план для решения проблемы",
        "Biomass": "Биомасса — материалы из растений или животных, которые можно использовать в качестве топлива",
        "Manure": "Навоз — отходы животных, используемые для удобрения почвы",
        "Subsidies": "Субсидии — поддержка (часто денежная), предоставляемая правительством для снижения затрат",
        "Incineration": "Сжигание — акт сжигания отходов",
        "Municipal": "Муниципальный — относящийся к городскому или местному правительству",
        "Efficient": "Эффективный — работающий хорошо и без потери энергии",
        "Pellets": "Пеллеты — маленькие спрессованные кусочки биомассы (обычно дерева), используемые в качестве топлива",
        "Anaerobic": "Анаэробный — без воздуха или кислорода, используется когда бактерии разлагают отходы для производства биогаза",
        "Digester": "Метатенк — герметичный резервуар, где органические отходы разлагаются для производства биогаза",
        "Genetic": "Генетический — относящийся к генам, ДНК и наследственности; черты или состояния, передаваемые от родителей к детям",
        "Notion": "Понятие — идея, убеждение или мнение о чем-то",
        "Tendencies": "Склонности — обычные способы поведения; модели в том, как кто-то часто действует или чувствует",
        "Delinquent": "Правонарушитель — молодой человек, который регулярно нарушает закон или правила",
        "Prominent": "Выдающийся — очень заметный, важный или хорошо известный",
        "Propensity": "Склонность — естественная тенденция или склонность действовать определенным образом",
        "Deviant": "Девиантный — ведущий себя способом, очень отличающимся от того, что считается нормальным или приемлемым",
        "Inherit": "Наследовать — получать черты, качества или собственность от родителей (либо биологически, либо юридически)"
    },
    "AE": {
        "Innovation": "Инновация — внедрение новых идей, методов или технологий",
        "Role": "Роль — функция или позиция, которую кто-то выполняет в определенной ситуации",
        "Take on": "Брать на себя — принимать ответственность за что-то или соглашаться выполнять задачу",
        "Motivation": "Мотивация — причина или причины для действия; желание что-то сделать",
        "Promote": "Продвигать — способствовать развитию или успеху чего-то; поддерживать или рекламировать",
        "Realistic": "Реалистичный — практичный и основанный на реальности, а не на идеальных представлениях",
        "Initiative": "Инициатива — способность принимать решения и действовать самостоятельно; новое действие или план",
        "Clarity": "Ясность — качество быть ясным, понятным и легко воспринимаемым",
        "Versus": "Против — используется для сравнения двух вещей или идей, которые противопоставляются друг другу",
        "Enthusiasm": "Энтузиазм — сильный интерес или волнение по поводу чего-то; страсть и энтузиазм",
        "Responsibility": "Ответственность — обязательство выполнить задачу или заботиться о чем-то; состояние быть ответственным",
        "Affordable": "Доступный — приемлемый по цене; такой, который можно себе позволить",
        "Alternative": "Альтернатива — другой вариант или выбор из двух или более возможностей",
        "Force": "Сила — физическая мощь или энергия; принуждение или давление",
        "Function": "Функционировать — работать или действовать определенным образом; выполнять свою функцию",
        "Gear": "Оборудование — механическое устройство или инструменты, необходимые для определенной деятельности",
        "Hazardous": "Опасный — представляющий риск или опасность; небезопасный",
        "Intention": "Намерение — цель или план действий; то, что кто-то намеревается сделать",
        "Inventor": "Изобретатель — человек, который создает или разрабатывает новые устройства, методы или процессы",
        "Power": "Питать — снабжать энергией или приводить в действие; обеспечивать работу",
        "Stream": "Течь — двигаться непрерывным потоком; передавать данные в потоковом режиме",
        "Summarize": "Суммировать — кратко изложить основные моменты; сделать резюме",
        "Throughout": "На протяжении — в течение всего времени или по всей площади; повсюду"
    }
};

class ScheduleApp {
    constructor() {
        this.selectedGroup = localStorage.getItem('selectedGroup');
        this.isFirstVisit = !this.selectedGroup;
        this.locale = localStorage.getItem('locale') || 'ru';
        this.holidays = JSON.parse(localStorage.getItem('holidays') || '[]');
        
        if (this.isFirstVisit) {
            this.showGroupSelectionModal();
            return;
        }
        
        this.scheduleData = schedules[this.selectedGroup] || schedules['CIE2501'];
        this.filteredData = { ...this.scheduleData };
        this.currentDay = 'Monday';
        this.notifications = [];
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
        this.reminderTime = parseInt(localStorage.getItem('reminderTime')) || 15;
        this.showGaps = localStorage.getItem('showGaps') !== 'false';
        this.minGapMinutes = parseInt(localStorage.getItem('minGapMinutes')) || 10;
        this.includeGapsInCalendar = localStorage.getItem('includeGapsInCalendar') === 'true';
        this.compactMode = localStorage.getItem('compactMode') === 'true';
        this.currentLesson = null;
        this.selectedCategory = localStorage.getItem('selectedDictionaryCategory') || 'AER'; // Выбранная категория словаря
        
        this.init();
    }



    init() {
        this.setupTelegramWebApp();
        this.setupEventListeners();
        this.setupTheme();
        this.setupNotifications();
        this.hideSplashSoon();
        this.updateCurrentGroupDisplay();
        this.highlightCurrentDay(); // Автоматически переключаем на текущий день
        this.renderSchedule();
        
        setTimeout(() => {
            this.updateFilters();
        }, 100);
        
        this.scheduleNotifications();
        
        
        setInterval(() => {
            this.renderSchedule();
        }, 60000);
        
        this.showWelcomeTips();
    }

    hideSplashSoon() {
        const splash = document.getElementById('splash');
        if (!splash) return;
        // Немного задержки для ощущения плавности
        setTimeout(() => {
            splash.classList.add('fade-in');
            splash.style.opacity = '0';
            splash.style.transition = 'opacity 300ms ease';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 320);
        }, 500);
    }

    changeGroup(groupId) {
        if (schedules[groupId]) {
            this.selectedGroup = groupId;
            localStorage.setItem('selectedGroup', groupId);
            this.scheduleData = schedules[groupId];
            this.filteredData = { ...this.scheduleData };
            this.updateFilters();
            this.renderSchedule();
            this.updateCurrentGroupDisplay();
            this.showQuickNotification('Группа изменена', `Выбрана группа ${groupId}`);
        }
    }

    updateCurrentGroupDisplay() {
        const currentGroupElement = document.getElementById('currentGroup');
        if (currentGroupElement) {
            currentGroupElement.textContent = `Группа: ${this.selectedGroup}`;
        }
    }

    showGroupSelectionModal() {
        const modal = document.getElementById('groupSelectionModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            const groupOptions = modal.querySelectorAll('.group-option');
            groupOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const groupId = option.getAttribute('data-group');
                    this.selectGroup(groupId);
                });
            });
        }
    }

    selectGroup(groupId) {
        this.selectedGroup = groupId;
        localStorage.setItem('selectedGroup', groupId);
        
        this.scheduleData = schedules[groupId];
        this.filteredData = { ...this.scheduleData };
        this.currentDay = 'Monday';
        this.notifications = [];
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
        this.reminderTime = parseInt(localStorage.getItem('reminderTime')) || 15;
        this.showGaps = localStorage.getItem('showGaps') !== 'false';
        this.minGapMinutes = parseInt(localStorage.getItem('minGapMinutes')) || 10;
        this.includeGapsInCalendar = localStorage.getItem('includeGapsInCalendar') === 'true';
        this.compactMode = localStorage.getItem('compactMode') === 'true';
        this.currentLesson = null;
        
        this.hideGroupSelectionModal();
        this.init();
    }

    hideGroupSelectionModal() {
        const modal = document.getElementById('groupSelectionModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    showCommonGaps() {
        const modal = document.getElementById('commonGapsModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            const content = document.getElementById('commonGapsContent');
            content.innerHTML = '';
            
            const commonGaps = this.findCommonGaps();
            
            if (commonGaps.length === 0) {
                content.innerHTML = `
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Общих окон не найдено</h3>
                        <p class="text-gray-600 dark:text-gray-400">У групп нет совпадающих окон в расписании</p>
                    </div>
                `;
                return;
            }
            
            const dayNames = {
                'Monday': 'Понедельник',
                'Tuesday': 'Вторник',
                'Wednesday': 'Среда',
                'Thursday': 'Четверг',
                'Friday': 'Пятница'
            };
            
            // Группируем общие окна по дням недели
            const gapsByDay = {};
            commonGaps.forEach(gap => {
                if (!gapsByDay[gap.day]) {
                    gapsByDay[gap.day] = [];
                }
                gapsByDay[gap.day].push(gap);
            });

            // Создаем секции для каждого дня
            Object.keys(gapsByDay).forEach(day => {
                const daySection = document.createElement('div');
                daySection.className = 'day-section mb-6';
                
                const dayHeader = document.createElement('div');
                dayHeader.className = 'day-header mb-3';
                dayHeader.innerHTML = `
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        ${dayNames[day]}
                    </h3>
                `;
                
                daySection.appendChild(dayHeader);
                
                const gapsContainer = document.createElement('div');
                gapsContainer.className = 'space-y-3';
                
                gapsByDay[day].forEach(commonGap => {
                    const gapCard = document.createElement('div');
                    gapCard.className = 'common-gap-card p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg';
                    
                    gapCard.innerHTML = `
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">${commonGap.start} – ${commonGap.end}</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">${commonGap.duration}</span>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span class="text-sm text-gray-700 dark:text-gray-300">${commonGap.groups.join(', ')}</span>
                            </div>
                        </div>
                    `;
                    
                    gapsContainer.appendChild(gapCard);
                });
                
                daySection.appendChild(gapsContainer);
                content.appendChild(daySection);
            });
        }
    }

    hideCommonGapsModal() {
        const modal = document.getElementById('commonGapsModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    findCommonGaps() {
        const commonGaps = [];
        const currentGroupGaps = this.getGapsForGroup(this.selectedGroup);
        
        Object.keys(schedules).forEach(groupId => {
            if (groupId === this.selectedGroup) return;
            
            const otherGroupGaps = this.getGapsForGroup(groupId);
            
            currentGroupGaps.forEach(currentGap => {
                otherGroupGaps.forEach(otherGap => {
                    if (this.gapsOverlap(currentGap, otherGap)) {
                        const commonGap = {
                            day: currentGap.day,
                            start: this.getLaterTime(currentGap.start, otherGap.start),
                            end: this.getEarlierTime(currentGap.end, otherGap.end),
                            duration: this.calculateDuration(
                                this.getLaterTime(currentGap.start, otherGap.start),
                                this.getEarlierTime(currentGap.end, otherGap.end)
                            ),
                            groups: [this.selectedGroup, groupId]
                        };
                        
                        if (this.calculateMinutes(commonGap.duration) >= 10) {
                            const existingGap = commonGaps.find(gap => 
                                gap.day === commonGap.day && 
                                gap.start === commonGap.start && 
                                gap.end === commonGap.end
                            );
                            
                            if (existingGap) {
                                if (!existingGap.groups.includes(groupId)) {
                                    existingGap.groups.push(groupId);
                                }
                            } else {
                                commonGaps.push(commonGap);
                            }
                        }
                    }
                });
            });
        });
        
        return commonGaps.sort((a, b) => {
            const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.start.localeCompare(b.start);
        });
    }

    getGapsForGroup(groupId) {
        const gaps = [];
        const schedule = schedules[groupId];
        
        Object.keys(schedule).forEach(day => {
            schedule[day].forEach(item => {
                if (item.gap) {
                    gaps.push({
                        day: day,
                        start: item.start,
                        end: item.end,
                        duration: item.duration
                    });
                }
            });
        });
        
        return gaps;
    }

    gapsOverlap(gap1, gap2) {
        if (gap1.day !== gap2.day) return false;
        
        const gap1Start = this.timeToMinutes(gap1.start);
        const gap1End = this.timeToMinutes(gap1.end);
        const gap2Start = this.timeToMinutes(gap2.start);
        const gap2End = this.timeToMinutes(gap2.end);
        
        return gap1Start < gap2End && gap2Start < gap1End;
    }

    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    getLaterTime(time1, time2) {
        return this.timeToMinutes(time1) > this.timeToMinutes(time2) ? time1 : time2;
    }

    getEarlierTime(time1, time2) {
        return this.timeToMinutes(time1) < this.timeToMinutes(time2) ? time1 : time2;
    }

    calculateDuration(start, end) {
        const startMinutes = this.timeToMinutes(start);
        const endMinutes = this.timeToMinutes(end);
        const durationMinutes = endMinutes - startMinutes;
        
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        if (hours > 0 && minutes > 0) {
            return `${hours}ч ${minutes}м`;
        } else if (hours > 0) {
            return `${hours}ч`;
        } else {
            return `${minutes}м`;
        }
    }

    calculateMinutes(duration) {
        const match = duration.match(/(\d+)ч\s*(\d+)?м?/);
        if (match) {
            const hours = parseInt(match[1]) || 0;
            const minutes = parseInt(match[2]) || 0;
            return hours * 60 + minutes;
        }
        return 0;
    }

    setupTelegramWebApp() {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            
            const user = window.Telegram.WebApp.initDataUnsafe?.user;
            if (user) {
                console.log('Telegram user:', user);
            }
        }
    }

    setupEventListeners() {
        console.log('setupEventListeners вызвана');
        
        const elements = {
            themeToggle: document.getElementById('themeToggle'),
            settingsBtn: document.getElementById('settingsBtn'),
            closeSettings: document.getElementById('closeSettings'),
            searchInput: document.getElementById('searchInput'),
            courseFilter: document.getElementById('courseFilter'),
            teacherFilter: document.getElementById('teacherFilter'),
            roomFilter: document.getElementById('roomFilter'),
            todayFilter: document.getElementById('todayFilter'),
            groupSelect: document.getElementById('groupSelect'),
            commonGapsBtn: document.getElementById('commonGapsBtn'),
            homeworkDictBtn: document.getElementById('homeworkDictBtn')
        };
        
        Object.entries(elements).forEach(([name, element]) => {
            if (!element) {
                console.error(`Элемент ${name} не найден`);
            } else {
                console.log(`Элемент ${name} найден`);
            }
        });
        
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        if (elements.settingsBtn) {
            elements.settingsBtn.addEventListener('click', () => this.openSettings());
        }
        if (elements.closeSettings) {
            elements.closeSettings.addEventListener('click', () => this.closeSettings());
        }
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        if (elements.courseFilter) {
            elements.courseFilter.addEventListener('change', (e) => this.handleCourseFilter(e.target.value));
        }
        if (elements.teacherFilter) {
            elements.teacherFilter.addEventListener('change', (e) => this.handleTeacherFilter(e.target.value));
        }
        if (elements.roomFilter) {
            elements.roomFilter.addEventListener('change', (e) => this.handleRoomFilter(e.target.value));
        }
        if (elements.todayFilter) {
            elements.todayFilter.addEventListener('click', () => this.handleTodayFilter());
        }
        if (elements.groupSelect) {
            elements.groupSelect.addEventListener('change', (e) => this.changeGroup(e.target.value));
        }
        if (elements.commonGapsBtn) {
            elements.commonGapsBtn.addEventListener('click', () => this.showCommonGaps());
        }
        if (elements.homeworkDictBtn) {
            elements.homeworkDictBtn.addEventListener('click', () => this.showHomeworkDict());
        }
        
        const dayButtons = document.querySelectorAll('.day-btn');
        console.log('Найдено кнопок дней:', dayButtons.length);
        dayButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectDay(btn.getAttribute('data-day')));
        });
        
        const modalElements = {
            closeModal: document.getElementById('closeModal'),
            closeApp: document.getElementById('closeApp'),
            openInTelegram: document.getElementById('openInTelegram'),
            addToCalendar: document.getElementById('addToCalendar'),
            contactTeacher: document.getElementById('contactTeacher'),
            showOnMap: document.getElementById('showOnMap')
        };
        
        if (modalElements.closeModal) {
            modalElements.closeModal.addEventListener('click', () => this.closeModal());
        }
        if (modalElements.closeApp) {
            modalElements.closeApp.addEventListener('click', () => this.closeApp());
        }
        if (modalElements.openInTelegram) {
            modalElements.openInTelegram.addEventListener('click', () => this.openInTelegram());
        }
        if (modalElements.addToCalendar) {
            modalElements.addToCalendar.addEventListener('click', () => this.addToCalendar());
        }
        if (modalElements.contactTeacher) {
            modalElements.contactTeacher.addEventListener('click', () => this.contactTeacher());
        }
        if (modalElements.showOnMap) {
            modalElements.showOnMap.addEventListener('click', () => this.showOnMap());
        }
        const settingsElements = {
            notificationToggle: document.getElementById('notificationToggle'),
            reminderTime: document.getElementById('reminderTime'),
            minGapMinutes: document.getElementById('minGapMinutes'),
            gapsToggle: document.getElementById('gapsToggle'),
            calendarToggle: document.getElementById('calendarToggle'),
            compactToggle: document.getElementById('compactToggle'),
            localeSelect: document.getElementById('localeSelect'),
            holidayDate: document.getElementById('holidayDate'),
            addHolidayBtn: document.getElementById('addHolidayBtn')
        };
        
        if (settingsElements.notificationToggle) {
            settingsElements.notificationToggle.addEventListener('click', () => this.toggleNotifications());
        }
        if (settingsElements.reminderTime) {
            settingsElements.reminderTime.addEventListener('change', (e) => this.updateReminderTime(e.target.value));
        }
        if (settingsElements.minGapMinutes) {
            settingsElements.minGapMinutes.addEventListener('change', (e) => this.updateMinGapMinutes(e.target.value));
        }
        if (settingsElements.gapsToggle) {
            settingsElements.gapsToggle.addEventListener('click', () => this.toggleGaps());
        }
        if (settingsElements.calendarToggle) {
            settingsElements.calendarToggle.addEventListener('click', () => this.toggleGapsInCalendar());
        }
        if (settingsElements.compactToggle) {
            settingsElements.compactToggle.addEventListener('click', () => this.toggleCompactMode());
        }
        if (settingsElements.localeSelect) {
            settingsElements.localeSelect.value = this.locale;
            settingsElements.localeSelect.addEventListener('change', (e) => this.changeLocale(e.target.value));
        }
        if (settingsElements.addHolidayBtn && settingsElements.holidayDate) {
            settingsElements.addHolidayBtn.addEventListener('click', () => this.addHoliday(settingsElements.holidayDate.value));
        }
        const exportElements = {
            exportSchedule: document.getElementById('exportSchedule'),
            importSchedule: document.getElementById('importSchedule'),
            fileInput: document.getElementById('fileInput')
        };
        
        if (exportElements.exportSchedule) {
            exportElements.exportSchedule.addEventListener('click', () => this.exportSchedule());
        }
        if (exportElements.importSchedule) {
            exportElements.importSchedule.addEventListener('click', () => this.importSchedule());
        }
        if (exportElements.fileInput) {
            exportElements.fileInput.addEventListener('change', (e) => this.handleFileImport(e));
        }
        
        const closeCommonGapsModal = document.getElementById('closeCommonGapsModal');
        if (closeCommonGapsModal) {
            closeCommonGapsModal.addEventListener('click', () => this.hideCommonGapsModal());
        }
        
        const closeHomeworkDict = document.getElementById('closeHomeworkDict');
        if (closeHomeworkDict) {
            closeHomeworkDict.addEventListener('click', () => this.hideHomeworkDict());
        }
        
        const dictSearchInput = document.getElementById('dictSearchInput');
        if (dictSearchInput) {
            dictSearchInput.addEventListener('input', (e) => this.filterDictionary(e.target.value));
        }
        
        const startTestBtn = document.getElementById('startTestBtn');
        if (startTestBtn) {
            startTestBtn.addEventListener('click', () => this.startTest());
        }
        
        const startFlashcardsBtn = document.getElementById('startFlashcardsBtn');
        if (startFlashcardsBtn) {
            startFlashcardsBtn.addEventListener('click', () => this.startFlashcards());
        }
        
        // Обработчики для переключателей категорий
        const categoryAER = document.getElementById('categoryAER');
        const categoryAE = document.getElementById('categoryAE');
        
        if (categoryAER) {
            categoryAER.addEventListener('click', () => this.selectCategory('AER'));
        }
        if (categoryAE) {
            categoryAE.addEventListener('click', () => this.selectCategory('AE'));
        }


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeSettings();
                this.hideCommonGapsModal();
                this.hideHomeworkDict();
                return;
            }
            // Навигация по дням
            const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            const idx = order.indexOf(this.currentDay);
            if (e.key === 'ArrowLeft') {
                const prev = idx > 0 ? order[idx - 1] : order[order.length - 1];
                this.selectDay(prev);
            }
            if (e.key === 'ArrowRight') {
                const next = idx < order.length - 1 ? order[idx + 1] : order[0];
                this.selectDay(next);
            }
        });
    }
    changeLocale(locale) {
        this.locale = locale;
        localStorage.setItem('locale', locale);
        this.renderSchedule();
        this.updateCurrentGroupDisplay();
        this.showQuickNotification(this.t('languageChanged'), this.t('currentLanguage'));
    }

    addHoliday(dateStr) {
        if (!dateStr) return;
        if (!this.holidays.includes(dateStr)) {
            this.holidays.push(dateStr);
            localStorage.setItem('holidays', JSON.stringify(this.holidays));
            this.renderSchedule();
            this.showQuickNotification(this.t('holidayAdded'), dateStr);
        }
    }

    isHoliday(date) {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        const key = `${y}-${m}-${d}`;
        return this.holidays.includes(key);
    }

    t(key) {
        const dict = {
            ru: {
                Monday: 'Понедельник', Tuesday: 'Вторник', Wednesday: 'Среда', Thursday: 'Четверг', Friday: 'Пятница',
                noLessons: 'Пар нет',
                today: ' (сегодня)',
                freeTotal: 'Свободно',
                now: 'Сейчас идет',
                inXm: 'Через',
                minutesShort: 'м',
                languageChanged: 'Язык изменён',
                currentLanguage: 'Настройки сохранены',
                holidayAdded: 'Дата добавлена в праздники',
                holidayToday: 'Праздничный день — занятия отменены'
            },
            uz: {
                Monday: 'Dushanba', Tuesday: 'Seshanba', Wednesday: 'Chorshanba', Thursday: 'Payshanba', Friday: 'Juma',
                noLessons: 'Dars yo‘q',
                today: ' (bugun)',
                freeTotal: 'Bo‘sh',
                now: 'Hozir dars',
                inXm: 'Yana',
                minutesShort: 'daq',
                languageChanged: 'Til o‘zgartirildi',
                currentLanguage: 'Sozlamalar saqlandi',
                holidayAdded: 'Sana bayramlarga qo‘shildi',
                holidayToday: 'Bayram kuni — darslar bekor qilindi'
            },
            en: {
                Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday', Thursday: 'Thursday', Friday: 'Friday',
                noLessons: 'No classes',
                today: ' (today)',
                freeTotal: 'Free',
                now: 'Ongoing',
                inXm: 'In',
                minutesShort: 'm',
                languageChanged: 'Language changed',
                currentLanguage: 'Settings saved',
                holidayAdded: 'Date added to holidays',
                holidayToday: 'Holiday — classes canceled'
            }
        };
        return (dict[this.locale] && dict[this.locale][key]) || key;
    }

    setupTheme() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
            document.getElementById('sunIcon').classList.add('hidden');
            document.getElementById('moonIcon').classList.remove('hidden');
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
            document.getElementById('sunIcon').classList.add('hidden');
            document.getElementById('moonIcon').classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            document.getElementById('sunIcon').classList.remove('hidden');
            document.getElementById('moonIcon').classList.add('hidden');
        }
    }

    setupNotifications() {
        if ('Notification' in window && this.notificationsEnabled) {
            Notification.requestPermission();
        }
    }

    toggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled;
        localStorage.setItem('notificationsEnabled', this.notificationsEnabled);
        
        const thumb = document.getElementById('notificationThumb');
        const toggle = document.getElementById('notificationToggle');
        
        if (this.notificationsEnabled) {
            thumb.classList.add('translate-x-6');
            toggle.classList.add('bg-primary');
            toggle.classList.remove('bg-gray-200', 'dark:bg-gray-600');
            Notification.requestPermission();
        } else {
            thumb.classList.remove('translate-x-6');
            toggle.classList.remove('bg-primary');
            toggle.classList.add('bg-gray-200', 'dark:bg-gray-600');
        }
    }

    updateReminderTime(value) {
        this.reminderTime = parseInt(value);
        localStorage.setItem('reminderTime', this.reminderTime);
        this.scheduleNotifications();
    }

    updateMinGapMinutes(value) {
        this.minGapMinutes = parseInt(value);
        localStorage.setItem('minGapMinutes', this.minGapMinutes);
        this.renderSchedule();
    }

    toggleGaps() {
        this.showGaps = !this.showGaps;
        localStorage.setItem('showGaps', this.showGaps);
        this.renderSchedule();
    }

    toggleGapsInCalendar() {
        this.includeGapsInCalendar = !this.includeGapsInCalendar;
        localStorage.setItem('includeGapsInCalendar', this.includeGapsInCalendar);
    }

    toggleCompactMode() {
        this.compactMode = !this.compactMode;
        localStorage.setItem('compactMode', this.compactMode);
        this.renderSchedule();
    }

    scheduleNotifications() {
        this.notifications.forEach(notification => {
            clearTimeout(notification);
        });
        this.notifications = [];

        if (!this.notificationsEnabled || 'Notification' in window === false) return;

        const today = new Date();
        const currentDay = this.getDayName(today.getDay());
        const todayLessons = this.scheduleData[currentDay] || [];

        // Фильтруем только уроки (не окна)
        const actualLessons = todayLessons.filter(lesson => !lesson.gap && lesson.time);
        
        actualLessons.forEach(lesson => {
            const [startTime] = lesson.time.split('-');
            const [hours, minutes] = startTime.split(':').map(Number);
            
            const lessonDate = new Date();
            lessonDate.setHours(hours, minutes, 0, 0);
            
            const reminderDate = new Date(lessonDate.getTime() - this.reminderTime * 60000);
            
            if (reminderDate > today) {
                const timeout = setTimeout(() => {
                    this.showNotification(lesson);
                }, reminderDate.getTime() - today.getTime());
                
                this.notifications.push(timeout);
            }
        });
    }

    showNotification(lesson) {
        if (Notification.permission === 'granted') {
            new Notification(`Скоро пара: ${lesson.course}`, {
                body: `${lesson.time} - ${lesson.teacher} (${lesson.room})`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
            });
        }
    }

    getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }

    selectDay(day) {
        this.currentDay = day;
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        });
        
        const selectedBtn = document.querySelector(`[data-day="${day}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('bg-primary', 'text-white');
            selectedBtn.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        }
        
        this.renderSchedule();
    }

    renderSchedule() {
        const container = document.getElementById('scheduleContent');
        if (!container) {
            console.error('Элемент scheduleContent не найден');
            return;
        }
        container.innerHTML = '';

        const selectedDay = this.currentDay || 'Monday';
        const lessons = this.filteredData[selectedDay] || [];
        
        const dayCard = this.createDayCard(this.t(selectedDay), lessons, selectedDay);
        container.appendChild(dayCard);
    }

    createDayCard(dayName, lessons, dayKey) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 fade-in';
        
        const actualLessons = (lessons || []).filter(item => !item.gap && item.time);
        const computedGaps = computeGaps(actualLessons, this.minGapMinutes);
        const itemsToRender = this.showGaps ? mergeLessonsWithGaps(actualLessons, computedGaps, true) : actualLessons;
        const sortedItems = this.sortItemsByTime(itemsToRender);
        const lessonsCount = actualLessons.length;
        const gapsCount = this.showGaps ? computedGaps.length : 0;
        
        const isToday = this.isToday(dayKey);
        const todayClass = isToday ? 'border-primary border-2' : '';
        card.className += ` ${todayClass}`;
        
        const header = document.createElement('div');
        header.className = 'px-4 py-3 border-b border-gray-200 dark:border-gray-700';
        
        let headerText = `${lessonsCount} пар`;
        if (gapsCount > 0) {
            headerText += ` • ${gapsCount} окон`;
        }
        if (gapsCount > 0) {
            const totalFreeMinutes = computedGaps.reduce((sum, g) => sum + (g.durationMinutes || 0), 0);
            if (totalFreeMinutes > 0) {
                headerText += ` • ${this.t('freeTotal')}: ${formatDuration(totalFreeMinutes)}`;
            }
        }
        
        const currentTime = this.getCurrentTimeStatus(dayKey, lessons);
        
        header.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${dayName}${isToday ? this.t('today') : ''}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${headerText}</p>
                </div>
                ${currentTime ? `<div class="text-xs text-primary font-medium">${currentTime}</div>` : ''}
            </div>
        `;
        
        const content = document.createElement('div');
        content.className = this.compactMode ? 'p-2 space-y-2' : 'p-4 space-y-3';
        
        if (sortedItems.length === 0) {
            content.innerHTML = `
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p>${this.t('noLessons')}</p>
                </div>
            `;
        } else {
            sortedItems.forEach(item => {
                if (item.gap) {
                    const gapCard = this.createGapCard(item);
                    content.appendChild(gapCard);
                } else {
                    const lessonCard = this.createLessonCard(item);
                    content.appendChild(lessonCard);
                }
            });
        }
        
        card.appendChild(header);
        card.appendChild(content);
        return card;
    }

    sortItemsByTime(items) {
        return [...items].sort((a, b) => {
            let aTime, bTime;
            
            if (a.gap) {
                aTime = this.parseGapTime(a.start);
            } else {
                aTime = parseTime(a.time).startMinutes;
            }
            
            if (b.gap) {
                bTime = this.parseGapTime(b.start);
            } else {
                bTime = parseTime(b.time).startMinutes;
            }
            
            return aTime - bTime;
        });
    }

    parseGapTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    isToday(dayKey) {
        const today = new Date();
        const currentDay = this.getDayName(today.getDay());
        return dayKey === currentDay;
    }

    getCurrentTimeStatus(dayKey, lessons) {
        if (!this.isToday(dayKey)) return null;
        
        const now = new Date();
        if (this.isHoliday(now)) {
            return this.t('holidayToday');
        }
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        // Фильтруем только уроки (не окна)
        const actualLessons = lessons.filter(lesson => !lesson.gap && lesson.time);
        
        const sortedLessons = [...actualLessons].sort((a, b) => {
            const aTime = parseTime(a.time);
            const bTime = parseTime(b.time);
            return aTime.startMinutes - bTime.startMinutes;
        });
        
        for (let lesson of sortedLessons) {
            const lessonTime = parseTime(lesson.time);
            if (currentTime >= lessonTime.startMinutes && currentTime <= lessonTime.endMinutes) {
                const remaining = lessonTime.endMinutes - currentTime;
                return `Сейчас идет • осталось ${remaining}м`;
            }
            if (lessonTime.startMinutes > currentTime) {
                const minutesUntil = lessonTime.startMinutes - currentTime;
                if (minutesUntil <= 30) {
                    return `Через ${minutesUntil}м`;
                }
                break;
            }
        }
        
        return null;
    }

    getLessonProgress(lesson) {
        if (!lesson || !lesson.time) return null;
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const { startMinutes, endMinutes } = parseTime(lesson.time);
        if (currentTime < startMinutes || currentTime > endMinutes) return null;
        const total = endMinutes - startMinutes;
        const elapsed = currentTime - startMinutes;
        const percent = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
        const remainingMinutes = endMinutes - currentTime;
        return { percent, remainingMinutes };
    }

    createGapCard(gap) {
        const card = document.createElement('div');
        const cardClass = 'gap-card p-3';
        
        card.className = cardClass;
        
        card.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Окно • ${gap.duration || gap.pretty}
                        </h4>
                        <span class="text-xs text-gray-500 dark:text-gray-400">${gap.start}–${gap.end}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Свободное время</p>
                </div>
            </div>
        `;
        
        return card;
    }

    createLessonCard(lesson) {
        const card = document.createElement('div');
        const cardClass = this.compactMode 
            ? 'lesson-card p-2 cursor-pointer'
            : 'lesson-card p-4 cursor-pointer';
        
        card.className = cardClass;
        card.addEventListener('click', () => this.openLessonModal(lesson));
        
        const courseColor = this.getCourseColor(lesson.course);
        const isCurrentLesson = this.isCurrentLesson(lesson);
        const currentClass = isCurrentLesson ? 'ring-2 ring-primary ring-opacity-50' : '';
        card.className += ` ${currentClass}`;
        
        if (this.compactMode) {
            card.innerHTML = `
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full ${courseColor}"></div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h4 class="text-xs font-medium text-gray-900 dark:text-white truncate">${lesson.course}${isCurrentLesson ? ' 🔴' : ''}</h4>
                            <span class="text-xs text-gray-500 dark:text-gray-400">${lesson.time}</span>
                        </div>
                        <p class="text-xs text-gray-600 dark:text-gray-300 truncate">
                            <span class="teacher-link cursor-pointer hover:text-primary" data-email="${lesson.email}">${lesson.teacher}</span> • 
                            <span class="room-copy cursor-pointer hover:text-primary" data-room="${lesson.room}">${lesson.room}</span>
                        </p>
                        ${(() => { const p = this.getLessonProgress(lesson); return p ? `<div class=\"w-full h-1 bg-gray-200 dark:bg-gray-700 rounded mt-1\"><div class=\"h-1 bg-primary rounded\" style=\"width:${p.percent}%\"></div></div><div class=\"text-[10px] text-gray-500 dark:text-gray-400 mt-0.5\">осталось ${p.remainingMinutes}м</div>` : '' })()}
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                        <div class="w-3 h-3 rounded-full ${courseColor} mt-2"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${lesson.course}${isCurrentLesson ? ' 🔴' : ''}</h4>
                            <span class="text-xs text-gray-500 dark:text-gray-400">${lesson.time}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            <span class="teacher-link cursor-pointer hover:text-primary underline" data-email="${lesson.email}">${lesson.teacher}</span>
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span class="room-copy cursor-pointer hover:text-primary underline" data-room="${lesson.room}">${lesson.room}</span>
                        </p>
                        ${(() => { const p = this.getLessonProgress(lesson); return p ? `<div class=\"w-full h-1 bg-gray-200 dark:bg-gray-700 rounded mt-2\"><div class=\"h-1 bg-primary rounded\" style=\"width:${p.percent}%\"></div></div><p class=\"text-xs text-primary font-medium mt-1\">Сейчас идет • осталось ${p.remainingMinutes}м</p>` : (isCurrentLesson ? '<p class=\"text-xs text-primary font-medium mt-1\">Сейчас идет</p>' : '') })()}
                    </div>
                </div>
            `;
        }
        
        card.querySelectorAll('.teacher-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const email = e.target.getAttribute('data-email');
                if (email) {
                    const subject = encodeURIComponent(`Вопрос по предмету ${lesson.course}`);
                    const body = encodeURIComponent('Здравствуйте!\n\n');
                    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
                    window.open(mailtoLink);
                }
            });
        });
        
        card.querySelectorAll('.room-copy').forEach(room => {
            room.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomNumber = e.target.getAttribute('data-room');
                if (roomNumber) {
                    navigator.clipboard.writeText(roomNumber).then(() => {
                        this.showQuickNotification('Скопировано!', `Аудитория ${roomNumber} скопирована в буфер`);
                    }).catch(() => {
                        this.showQuickNotification('Ошибка', 'Не удалось скопировать аудиторию');
                    });
                }
            });
        });
        
        return card;
    }

    isCurrentLesson(lesson) {
        // Проверяем, что это урок (не окно) и есть время
        if (lesson.gap || !lesson.time) return false;
        
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const currentDay = this.getDayName(now.getDay());
        
        if (!this.isToday(currentDay)) return false;
        
        const lessonTime = parseTime(lesson.time);
        return currentTime >= lessonTime.startMinutes && currentTime <= lessonTime.endMinutes;
    }

    getCourseColor(course) {
        const colors = {
            'CAL1': 'bg-blue-500',
            'AE1': 'bg-purple-500',
            'P1': 'bg-cyan-500',
            'OOP1': 'bg-green-500',
            'AER': 'bg-yellow-500',
            'PE1': 'bg-red-500'
        };
        return colors[course] || 'bg-gray-500';
    }

    highlightCurrentDay() {
        const today = new Date();
        const currentDay = this.getDayName(today.getDay());
        const dayBtn = document.querySelector(`[data-day="${currentDay}"]`);
        
        if (dayBtn) {
            // Переключаем на текущий день
            this.currentDay = currentDay;
            
            // Обновляем стили кнопок
            document.querySelectorAll('.day-btn').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            });
            
            // Подсвечиваем текущий день
            dayBtn.classList.add('bg-primary', 'text-white');
            dayBtn.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        }
    }

    openLessonModal(lesson) {
        const modal = document.getElementById('lessonModal');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = lesson.course;
        
        const courseColor = this.getCourseColor(lesson.course);
        
        content.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 rounded-full ${courseColor}"></div>
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">${lesson.course}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${lesson.time}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="text-sm text-gray-700 dark:text-gray-300">${lesson.teacher}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span class="text-sm text-gray-700 dark:text-gray-300">${lesson.room}</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        this.currentLesson = lesson;
    }

    closeModal() {
        const modal = document.getElementById('lessonModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    addToCalendar() {
        if (!this.currentLesson) return;
        
        const lesson = this.currentLesson;
        const [startTime, endTime] = lesson.time.split('-');
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(startHour, startMin, 0, 0);
        
        const endDate = new Date(today);
        endDate.setHours(endHour, endMin, 0, 0);
        
        let icsContent = this.generateICS(lesson, startDate, endDate);
        
        if (this.includeGapsInCalendar && lesson.gap) {
            icsContent = this.generateGapICS(lesson, startDate, endDate);
        }
        
        const filename = lesson.gap ? `Окно_${lesson.pretty}.ics` : `${lesson.course}.ics`;
        this.downloadFile(icsContent, filename, 'text/calendar');
    }

    generateICS(lesson, startDate, endDate) {
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Schedule App//Schedule//EN
BEGIN:VEVENT
UID:${Date.now()}@schedule.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${lesson.course}
DESCRIPTION:Преподаватель: ${lesson.teacher}\\nКабинет: ${lesson.room}
LOCATION:${lesson.room}
END:VEVENT
END:VCALENDAR`;
    }

    generateGapICS(gap, startDate, endDate) {
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Schedule App//Schedule//EN
BEGIN:VEVENT
UID:${Date.now()}-gap@schedule.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Окно — свободное время
DESCRIPTION:Свободное время между парами\\nДлительность: ${gap.pretty}
LOCATION:ИУТ
END:VEVENT
END:VCALENDAR`;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    contactTeacher() {
        if (!this.currentLesson || !this.currentLesson.email) return;
        
        const subject = encodeURIComponent(`Вопрос по предмету ${this.currentLesson.course}`);
        const body = encodeURIComponent('Здравствуйте!\n\n');
        const mailtoLink = `mailto:${this.currentLesson.email}?subject=${subject}&body=${body}`;
        
        window.open(mailtoLink);
    }

    showOnMap() {
        if (!this.currentLesson) return;
        
        const room = this.currentLesson.room;
        const query = encodeURIComponent(`ИУТ ${room}`);
        const mapUrl = `https://maps.google.com/maps?q=${query}`;
        
        window.open(mapUrl, '_blank');
    }

    handleSearch(query) {
        this.applyFilters();
    }

    handleCourseFilter(course) {
        this.applyFilters();
    }

    handleTeacherFilter(teacher) {
        this.applyFilters();
    }

    handleRoomFilter(room) {
        this.applyFilters();
    }

    handleTodayFilter() {
        const btn = document.getElementById('todayFilter');
        const isActive = btn.classList.contains('bg-primary');
        
        if (isActive) {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            btn.textContent = 'Только сегодня';
        } else {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            btn.textContent = 'Показать все';
        }
        
        this.applyFilters();
    }

    applyFilters() {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const courseFilter = document.getElementById('courseFilter').value;
        const teacherFilter = document.getElementById('teacherFilter').value;
        const roomFilter = document.getElementById('roomFilter').value;
        const todayFilter = document.getElementById('todayFilter').classList.contains('bg-primary');
        
        this.filteredData = {};
        
        Object.keys(this.scheduleData).forEach(day => {
            let lessons = this.scheduleData[day] || [];
            
            if (todayFilter) {
                const today = new Date();
                const currentDay = this.getDayName(today.getDay());
                if (day !== currentDay) {
                    lessons = [];
                }
            }
            // Если сегодня праздник — скрываем пары сегодняшнего дня
            const today = new Date();
            const currentDay = this.getDayName(today.getDay());
            if (day === currentDay && this.isHoliday(today)) {
                lessons = [];
            }
            
            lessons = lessons.filter(item => {
                if (item.gap) {
                    return true;
                }
                
                const matchesSearch = !searchQuery || 
                    item.course.toLowerCase().includes(searchQuery) ||
                    item.teacher.toLowerCase().includes(searchQuery) ||
                    item.room.toLowerCase().includes(searchQuery) ||
                    item.time.includes(searchQuery);
                
                const matchesCourse = !courseFilter || item.course === courseFilter;
                const matchesTeacher = !teacherFilter || item.teacher === teacherFilter;
                const matchesRoom = !roomFilter || item.room === roomFilter;
                
                return matchesSearch && matchesCourse && matchesTeacher && matchesRoom;
            });
            
            this.filteredData[day] = lessons;
        });
        
        this.renderSchedule();
    }

    updateFilters() {
        const teachers = new Set();
        const rooms = new Set();
        const courses = new Set();
        
        Object.values(this.scheduleData).forEach(lessons => {
            lessons.forEach(lesson => {
                if (!lesson.gap) {
                    teachers.add(lesson.teacher);
                    rooms.add(lesson.room);
                    courses.add(lesson.course);
                }
            });
        });
        
        const teacherSelect = document.getElementById('teacherFilter');
        const roomSelect = document.getElementById('roomFilter');
        const courseSelect = document.getElementById('courseFilter');
        
        if (!teacherSelect || !roomSelect || !courseSelect) {
            console.error('Не найдены элементы фильтров');
            return;
        }
        
        teacherSelect.innerHTML = '<option value="">Все преподаватели</option>';
        roomSelect.innerHTML = '<option value="">Все кабинеты</option>';
        courseSelect.innerHTML = '<option value="">Все предметы</option>';
        
        Array.from(teachers).sort().forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher;
            option.textContent = teacher;
            teacherSelect.appendChild(option);
        });
        
        Array.from(rooms).sort().forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });
        
        Array.from(courses).sort().forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseSelect.appendChild(option);
        });
        
        console.log('Фильтры обновлены:', {
            teachers: Array.from(teachers),
            rooms: Array.from(rooms),
            courses: Array.from(courses)
        });
    }

   

    closeSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    exportSchedule() {
        const dataStr = JSON.stringify(this.scheduleData, null, 2);
        this.downloadFile(dataStr, 'schedule.json', 'application/json');
    }

    importSchedule() {
        document.getElementById('fileInput').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.scheduleData = data;
                this.filteredData = { ...data };
                this.renderSchedule();
                this.updateFilters();
                this.scheduleNotifications();
            } catch (error) {
                alert('Ошибка при загрузке файла. Проверьте формат JSON.');
            }
        };
        reader.readAsText(file);
    }

    closeApp() {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
        } else {
            window.close();
        }
    }

    showWelcomeTips() {
        // Показываем подсказки для новых пользователей
        if (localStorage.getItem('welcomeTipsShown') !== 'true') {
            setTimeout(() => {
                this.showQuickNotification('Добро пожаловать!', 'Используйте фильтры для поиска нужных пар');
                localStorage.setItem('welcomeTipsShown', 'true');
            }, 1000);
        }
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    showQuickNotification(title, message) {
        // Создаем простое уведомление
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 fade-in';
        notification.innerHTML = `
            <div class="font-semibold">${title}</div>
            <div class="text-sm opacity-90">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showHomeworkDict() {
        const modal = document.getElementById('homeworkDictModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            this.updateCategoryButtons();
            this.updateCategoryCounts();
            this.renderDictionary();
        }
    }
    
    selectCategory(category) {
        this.selectedCategory = category;
        localStorage.setItem('selectedDictionaryCategory', category);
        this.updateCategoryButtons();
        this.renderDictionary();
        // Очищаем поиск при смене категории
        const searchInput = document.getElementById('dictSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
    }
    
    updateCategoryButtons() {
        const categoryAER = document.getElementById('categoryAER');
        const categoryAE = document.getElementById('categoryAE');
        
        if (categoryAER) {
            if (this.selectedCategory === 'AER') {
                categoryAER.classList.add('active');
            } else {
                categoryAER.classList.remove('active');
            }
        }
        
        if (categoryAE) {
            if (this.selectedCategory === 'AE') {
                categoryAE.classList.add('active');
            } else {
                categoryAE.classList.remove('active');
            }
        }
    }
    
    updateCategoryCounts() {
        const aerCount = document.getElementById('aerCount');
        const aeCount = document.getElementById('aeCount');
        
        if (aerCount) {
            const count = Object.keys(homeworkDictionary['AER'] || {}).length;
            aerCount.textContent = count;
        }
        
        if (aeCount) {
            const count = Object.keys(homeworkDictionary['AE'] || {}).length;
            aeCount.textContent = count;
        }
    }

    hideHomeworkDict() {
        const modal = document.getElementById('homeworkDictModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    renderDictionary(searchTerm = '') {
        const content = document.getElementById('homeworkDictContent');
        if (!content) return;

        content.innerHTML = '';

        // Показываем только выбранную категорию
        const category = this.selectedCategory || 'AER';
        const terms = homeworkDictionary[category] || {};
        const filteredTerms = Object.entries(terms).filter(([english, russian]) => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return english.toLowerCase().includes(searchLower) || 
                   russian.toLowerCase().includes(searchLower);
        });

        if (filteredTerms.length === 0) {
            content.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">Слова не найдены</p>
                </div>
            `;
            return;
        }

        const categorySection = document.createElement('div');
        categorySection.className = 'category-section mb-6';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header mb-4';
        
        // Определяем цвет и описание для категории
        let categoryColor = 'bg-gray-500';
        let categoryDescription = '';
        
        switch(category) {
            case 'AER':
                categoryColor = 'bg-blue-500';
                categoryDescription = 'Академическое чтение на английском языке';
                break;
            case 'AE':
                categoryColor = 'bg-purple-500';
                categoryDescription = 'Академический английский';
                break;
        }
        
        categoryHeader.innerHTML = `
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="w-3 h-3 rounded-full mr-3 ${categoryColor}"></span>
                ${category}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ${categoryDescription}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Найдено слов: ${filteredTerms.length} из ${Object.keys(terms).length}
            </p>
        `;

        categorySection.appendChild(categoryHeader);

        const termsContainer = document.createElement('div');
        termsContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4';

        filteredTerms.forEach(([english, russian]) => {
            const termCard = document.createElement('div');
            termCard.className = 'term-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200';
            
            termCard.innerHTML = `
                <div class="flex items-start justify-between gap-2 sm:gap-3">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 dark:text-white mb-1 break-words">${english}</h4>
                        <p class="text-gray-600 dark:text-gray-400 break-words">${russian}</p>
                    </div>
                    <div class="ml-2 sm:ml-3 flex-shrink-0">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${this.getCategoryTagClass(category)} whitespace-nowrap">
                            ${category}
                        </span>
                    </div>
                </div>
            `;

            termsContainer.appendChild(termCard);
        });

        categorySection.appendChild(termsContainer);
        content.appendChild(categorySection);
    }

    filterDictionary(searchTerm) {
        this.renderDictionary(searchTerm);
    }

    getCategoryTagClass(category) {
        switch(category) {
            case 'AER':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'AE':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    }

    startTest() {
        this.testData = {
            currentQuestion: 0,
            score: 0,
            totalQuestions: 0,
            questions: [],
            answers: []
        };
        
        this.generateTestQuestions();
        this.showTestQuestion();
    }

    generateTestQuestions() {
        // Используем только выбранную категорию
        const category = this.selectedCategory || 'AER';
        const categoryWords = homeworkDictionary[category] || {};
        const words = Object.entries(categoryWords).map(([english, russian]) => ({
            english,
            russian,
            category
        }));
        
        this.testData.totalQuestions = Math.min(10, words.length);
        this.testData.questions = [];
        
        // Случайно выбираем слова для теста
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < this.testData.totalQuestions; i++) {
            const wordObj = shuffledWords[i];
            const { english, russian, category } = wordObj;
            const questionType = Math.random() < 0.5 ? 'translate' : 'definition';
            
            if (questionType === 'translate') {
                // Тест на перевод: английское слово -> русский перевод
                const correctAnswer = russian.split(' — ')[0]; // Берем только основное значение
                const wrongAnswers = this.getWrongAnswers(words, correctAnswer, 3);
                const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
                
                this.testData.questions.push({
                    type: 'translate',
                    question: `Переведите слово: "${english}"`,
                    correctAnswer: correctAnswer,
                    allAnswers: allAnswers,
                    word: english,
                    category: category
                });
            } else {
                // Тест на определение: русское определение -> английское слово
                const wrongWords = this.getWrongWords(words, english, 3);
                const allWordsForQuestion = [english, ...wrongWords].sort(() => Math.random() - 0.5);
                
                this.testData.questions.push({
                    type: 'definition',
                    question: `Какое слово означает: "${russian.split(' — ')[1] || russian}"`,
                    correctAnswer: english,
                    allAnswers: allWordsForQuestion,
                    word: english,
                    category: category
                });
            }
        }
    }

    getWrongAnswers(words, correctAnswer, count) {
        const wrongAnswers = [];
        const usedAnswers = new Set([correctAnswer]);
        
        while (wrongAnswers.length < count && wrongAnswers.length < words.length - 1) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            const answer = randomWord.russian.split(' — ')[0];
            if (!usedAnswers.has(answer)) {
                wrongAnswers.push(answer);
                usedAnswers.add(answer);
            }
        }
        
        return wrongAnswers;
    }

    getWrongWords(words, correctWord, count) {
        const wrongWords = [];
        const usedWords = new Set([correctWord]);
        
        while (wrongWords.length < count && wrongWords.length < words.length - 1) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            const word = randomWord.english;
            if (!usedWords.has(word)) {
                wrongWords.push(word);
                usedWords.add(word);
            }
        }
        
        return wrongWords;
    }

    showTestQuestion() {
        const content = document.getElementById('homeworkDictContent');
        if (!content) return;

        const question = this.testData.questions[this.testData.currentQuestion];
        
        content.innerHTML = `
            <div class="test-container">
                <div class="test-header mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Тест по словарю</h3>
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            Вопрос ${this.testData.currentQuestion + 1} из ${this.testData.totalQuestions}
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                             style="width: ${((this.testData.currentQuestion + 1) / this.testData.totalQuestions) * 100}%"></div>
                    </div>
                </div>
                
                <div class="test-question mb-6">
                    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">${question.question}</h4>
                        <div class="space-y-3">
                            ${question.allAnswers.map((answer, index) => `
                                <button class="answer-btn w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" 
                                        data-answer="${answer}">
                                    <div class="flex items-center">
                                        <span class="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 mr-3 flex items-center justify-center">
                                            <span class="text-sm font-medium">${String.fromCharCode(65 + index)}</span>
                                        </span>
                                        <span class="text-gray-900 dark:text-white">${answer}</span>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="test-actions flex justify-between">
                    <button id="skipQuestion" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        Пропустить
                    </button>
                    <button id="showHint" class="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
                        Подсказка
                    </button>
                </div>
            </div>
        `;

        // Добавляем обработчики событий
        content.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(e.target.closest('.answer-btn')));
        });

        const skipBtn = content.querySelector('#skipQuestion');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.nextQuestion());
        }

        const hintBtn = content.querySelector('#showHint');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint(question));
        }
    }

    selectAnswer(button) {
        const selectedAnswer = button.getAttribute('data-answer');
        const question = this.testData.questions[this.testData.currentQuestion];
        
        // Отключаем все кнопки
        button.parentElement.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('hover:bg-gray-50', 'dark:hover:bg-gray-700');
        });

        // Подсвечиваем правильный и неправильный ответы
        button.parentElement.querySelectorAll('.answer-btn').forEach(btn => {
            const answer = btn.getAttribute('data-answer');
            if (answer === question.correctAnswer) {
                btn.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
                btn.querySelector('.w-6').classList.add('bg-green-500', 'border-green-500', 'text-white');
            } else if (answer === selectedAnswer && answer !== question.correctAnswer) {
                btn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
                btn.querySelector('.w-6').classList.add('bg-red-500', 'border-red-500', 'text-white');
            }
        });

        // Показываем анимацию успеха для правильного ответа
        if (selectedAnswer === question.correctAnswer) {
            this.showTestSuccessAnimation(button);
        }

        // Записываем ответ
        this.testData.answers.push({
            question: question,
            selectedAnswer: selectedAnswer,
            isCorrect: selectedAnswer === question.correctAnswer
        });

        if (selectedAnswer === question.correctAnswer) {
            this.testData.score++;
        }

        // Автоматически переходим к следующему вопросу через 1.5 секунды
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    showHint(question) {
        const category = question.category || "AER";
        const hint = homeworkDictionary[category]?.[question.word] || homeworkDictionary["AER"][question.word] || homeworkDictionary["AE"][question.word];
        if (hint) {
            this.showQuickNotification('Подсказка', hint);
        }
    }

    showTestSuccessAnimation(button) {
        // Добавляем анимацию пульса к правильному ответу
        button.classList.add('success-animation');
        
        // Создаем конфетти вокруг кнопки
        this.createTestConfetti(button);
        
        // Убираем анимацию через некоторое время
        setTimeout(() => {
            button.classList.remove('success-animation');
        }, 600);
    }

    createTestConfetti(button) {
        const rect = button.getBoundingClientRect();
        const container = button.closest('.test-question');
        
        for (let i = 0; i < 6; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.position = 'absolute';
            confetti.style.left = (rect.left + rect.width / 2 - 5) + 'px';
            confetti.style.top = (rect.top + rect.height / 2) + 'px';
            confetti.style.zIndex = '1000';
            
            // Случайные цвета для конфетти
            const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(confetti);
            
            // Удаляем конфетти после анимации
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 1000);
        }
    }

    nextQuestion() {
        this.testData.currentQuestion++;
        
        if (this.testData.currentQuestion < this.testData.totalQuestions) {
            this.showTestQuestion();
        } else {
            this.showTestResults();
        }
    }

    showTestResults() {
        const content = document.getElementById('homeworkDictContent');
        if (!content) return;

        const percentage = Math.round((this.testData.score / this.testData.totalQuestions) * 100);
        const isGood = percentage >= 70;
        
        content.innerHTML = `
            <div class="test-results text-center">
                <div class="mb-6">
                    <div class="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${isGood ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${isGood ? 
                                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>' :
                                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
                            }
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        ${isGood ? 'Отлично!' : 'Нужно подучить!'}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                        Вы набрали ${this.testData.score} из ${this.testData.totalQuestions} баллов (${percentage}%)
                    </p>
                </div>
                
                <div class="space-y-4 mb-6">
                    ${this.testData.answers.map((answer, index) => `
                        <div class="text-left p-4 border rounded-lg ${answer.isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900 dark:text-white">Вопрос ${index + 1}</span>
                                <span class="text-sm ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}">
                                    ${answer.isCorrect ? '✓ Правильно' : '✗ Неправильно'}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Ваш ответ:</strong> ${answer.selectedAnswer}<br>
                                <strong>Правильный ответ:</strong> ${answer.question.correctAnswer}
                            </p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button id="retakeTest" class="btn-secondary px-6 py-3 text-white rounded-lg w-full sm:w-auto">
                        Пройти еще раз
                    </button>
                    <button id="backToDict" class="btn-primary px-6 py-3 text-white rounded-lg w-full sm:w-auto">
                        Вернуться к словарю
                    </button>
                </div>
            </div>
        `;

        // Добавляем обработчики событий
        const retakeBtn = content.querySelector('#retakeTest');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => this.startTest());
        }

        const backBtn = content.querySelector('#backToDict');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.renderDictionary());
        }
    }

    startFlashcards() {
        this.flashcardData = {
            currentCard: 0,
            cards: [],
            knownCards: [],
            unknownCards: [],
            isFlipped: false
        };
        
        this.generateFlashcards();
        this.showFlashcard();
    }

    generateFlashcards() {
        // Используем только выбранную категорию
        const category = this.selectedCategory || 'AER';
        const categoryWords = homeworkDictionary[category] || {};
        const words = Object.entries(categoryWords);
        
        this.flashcardData.cards = words.map(([english, russian]) => ({
            english: english,
            russian: russian,
            definition: russian.split(' — ')[1] || russian,
            mainTranslation: russian.split(' — ')[0],
            category: category
        }));
        
        // Перемешиваем карточки
        this.flashcardData.cards = this.flashcardData.cards.sort(() => Math.random() - 0.5);
    }

    showFlashcard() {
        const content = document.getElementById('homeworkDictContent');
        if (!content) return;

        const card = this.flashcardData.cards[this.flashcardData.currentCard];
        
        content.innerHTML = `
            <div class="flashcard-container">
                <div class="flashcard-progress">
                    ${this.flashcardData.cards.map((_, index) => `
                        <div class="progress-dot ${index === this.flashcardData.currentCard ? 'active' : ''} ${index < this.flashcardData.currentCard ? 'completed' : ''}"></div>
                    `).join('')}
                </div>
                
                <div class="text-center mb-4">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Карточки для запоминания</h3>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Карточка ${this.flashcardData.currentCard + 1} из ${this.flashcardData.cards.length}
                    </p>
                </div>
                
                <div class="flashcard" id="flashcard">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <div class="flashcard-word">${card.english}</div>
                            <div class="flashcard-hint">Нажмите, чтобы увидеть перевод</div>
                        </div>
                        <div class="flashcard-back">
                            <div class="flashcard-word">${card.mainTranslation}</div>
                            <div class="flashcard-definition">${card.definition}</div>
                        </div>
                    </div>
                </div>
                
                <div class="flashcard-controls">
                    <button class="flashcard-btn dont-know" id="dontKnowBtn">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span class="text-sm sm:text-base">Не знаю</span>
                    </button>
                    <button class="flashcard-btn know" id="knowBtn">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span class="text-sm sm:text-base">Знаю</span>
                    </button>
                </div>
                
                <div class="text-center mt-4">
                    <button id="backToDictFromCards" class="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        ← Вернуться к словарю
                    </button>
                </div>
            </div>
        `;

        // Добавляем обработчики событий
        const flashcard = content.querySelector('#flashcard');
        if (flashcard) {
            flashcard.addEventListener('click', () => this.flipCard());
        }

        const dontKnowBtn = content.querySelector('#dontKnowBtn');
        if (dontKnowBtn) {
            dontKnowBtn.addEventListener('click', () => this.markCardAsUnknown());
        }

        const knowBtn = content.querySelector('#knowBtn');
        if (knowBtn) {
            knowBtn.addEventListener('click', () => this.markCardAsKnown());
        }

        const backBtn = content.querySelector('#backToDictFromCards');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.renderDictionary());
        }
    }

    flipCard() {
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.classList.toggle('flipped');
            this.flashcardData.isFlipped = !this.flashcardData.isFlipped;
        }
    }

    markCardAsKnown() {
        const card = this.flashcardData.cards[this.flashcardData.currentCard];
        this.flashcardData.knownCards.push(card);
        
        this.showSuccessAnimation();
        this.nextFlashcard();
    }

    markCardAsUnknown() {
        const card = this.flashcardData.cards[this.flashcardData.currentCard];
        this.flashcardData.unknownCards.push(card);
        
        this.nextFlashcard();
    }

    showSuccessAnimation() {
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            // Добавляем анимацию успеха
            flashcard.classList.add('success-animation');
            
            // Создаем конфетти
            this.createConfetti();
            
            // Убираем анимацию через некоторое время
            setTimeout(() => {
                flashcard.classList.remove('success-animation');
            }, 600);
        }
    }

    createConfetti() {
        const flashcard = document.getElementById('flashcard');
        if (!flashcard) return;

        for (let i = 0; i < 4; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = (20 + i * 20) + '%';
            confetti.style.top = '50%';
            flashcard.appendChild(confetti);
            
            // Удаляем конфетти после анимации
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 1000);
        }
    }

    nextFlashcard() {
        this.flashcardData.currentCard++;
        
        if (this.flashcardData.currentCard < this.flashcardData.cards.length) {
            this.flashcardData.isFlipped = false;
            this.showFlashcard();
        } else {
            this.showFlashcardResults();
        }
    }

    showFlashcardResults() {
        const content = document.getElementById('homeworkDictContent');
        if (!content) return;

        const knownCount = this.flashcardData.knownCards.length;
        const unknownCount = this.flashcardData.unknownCards.length;
        const totalCount = this.flashcardData.cards.length;
        const percentage = Math.round((knownCount / totalCount) * 100);

        content.innerHTML = `
            <div class="flashcard-results text-center">
                <div class="mb-6">
                    <div class="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${percentage >= 70 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Отлично! Вы изучили карточки
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                        Знаете: ${knownCount} из ${totalCount} слов (${percentage}%)
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">✓ Знаете (${knownCount})</h4>
                        <div class="text-sm text-green-700 dark:text-green-300">
                            ${this.flashcardData.knownCards.map(card => card.english).join(', ')}
                        </div>
                    </div>
                    
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h4 class="font-semibold text-red-800 dark:text-red-200 mb-2">✗ Нужно повторить (${unknownCount})</h4>
                        <div class="text-sm text-red-700 dark:text-red-300">
                            ${this.flashcardData.unknownCards.map(card => card.english).join(', ')}
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button id="repeatUnknown" class="btn-secondary px-6 py-3 text-white rounded-lg w-full sm:w-auto">
                        Повторить неизвестные
                    </button>
                    <button id="repeatAll" class="btn-primary px-6 py-3 text-white rounded-lg w-full sm:w-auto">
                        Повторить все
                    </button>
                    <button id="backToDictFromResults" class="btn-accent px-6 py-3 text-white rounded-lg w-full sm:w-auto">
                        К словарю
                    </button>
                </div>
            </div>
        `;

        // Добавляем обработчики событий
        const repeatUnknownBtn = content.querySelector('#repeatUnknown');
        if (repeatUnknownBtn) {
            repeatUnknownBtn.addEventListener('click', () => {
                this.flashcardData.cards = this.flashcardData.unknownCards;
                this.flashcardData.currentCard = 0;
                this.flashcardData.knownCards = [];
                this.flashcardData.unknownCards = [];
                this.showFlashcard();
            });
        }

        const repeatAllBtn = content.querySelector('#repeatAll');
        if (repeatAllBtn) {
            repeatAllBtn.addEventListener('click', () => {
                this.startFlashcards();
            });
        }

        const backBtn = content.querySelector('#backToDictFromResults');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.renderDictionary());
        }
    }








}

document.addEventListener('DOMContentLoaded', () => {
    new ScheduleApp();
});