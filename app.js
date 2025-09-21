
function parseTime(timeStr) {
    const [start, end] = timeStr.split('-');
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

const schedule = {
  "Monday": [
    {
      "time": "11:00-12:30",
      "course": "CAL1",
      "teacher": "U.Safarov",
      "room": "B210",
      "email": "u.safarov@iut.uz"
    },
    {
      "time": "12:30-14:00",
      "course": "AE1",
      "teacher": "U.Ubaydullaeva",
      "room": "A708",
      "email": "u.ubaydullaeva@iut.uz"
    },
    {
      "gap": true,
      "start": "14:00",
      "end": "15:30",
      "duration": "1h 30m"
    },
    {
      "time": "15:30-17:00",
      "course": "P1",
      "teacher": "F.Atamurotov",
      "room": "A605",
      "email": "f.atamurotov@iut.uz"
    }
  ],
  "Tuesday": [
    {
      "time": "9:30-11:00",
      "course": "OOP1",
      "teacher": "Sh.Suvanov",
      "room": "B102 PC Lab",
      "email": "sh.suvanov@iut.uz"
    },
    {
      "time": "11:00-12:30",
      "course": "AER",
      "teacher": "A.Khalilova",
      "room": "A705",
      "email": "a.khalilova@iut.uz"
    }
  ],
  "Wednesday": [
    {
      "time": "9:30-11:00",
      "course": "P1",
      "teacher": "F.Atamurotov",
      "room": "A607",
      "email": "f.atamurotov@iut.uz"
    },
    {
      "gap": true,
      "start": "11:00",
      "end": "12:30",
      "duration": "1h 30m"
    },
    {
      "time": "12:30-14:00",
      "course": "OOP1",
      "teacher": "Sh.Suvanov",
      "room": "B102 PC Lab",
      "email": "sh.suvanov@iut.uz"
    },
    {
      "time": "14:00-15:30",
      "course": "AE1",
      "teacher": "U.Ubaydullaeva",
      "room": "A705",
      "email": "u.ubaydullaeva@iut.uz"
    }
  ],
  "Thursday": [
    {
      "time": "9:30-11:00",
      "course": "CAL1",
      "teacher": "U.Safarov",
      "room": "A203",
      "email": "u.safarov@iut.uz"
    },
    {
      "gap": true,
      "start": "11:00",
      "end": "11:30",
      "duration": "30m"
    },
    {
      "time": "11:30-13:00",
      "course": "PE1",
      "teacher": "F.Atamurotov",
      "room": "A502/A504",
      "email": "f.atamurotov@iut.uz"
    }
  ],
  "Friday": []
};

class ScheduleApp {
    constructor() {
        this.scheduleData = schedule;
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
        
        this.init();
    }



    init() {
        this.setupTelegramWebApp();
        this.setupEventListeners();
        this.setupTheme();
        this.setupNotifications();
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
            todayFilter: document.getElementById('todayFilter')
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
            compactToggle: document.getElementById('compactToggle')
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


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeSettings();
            }
        });
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

        todayLessons.forEach(lesson => {
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
        console.log('renderSchedule вызвана');
        console.log('currentDay:', this.currentDay);
        console.log('filteredData:', this.filteredData);
        
        const container = document.getElementById('scheduleContent');
        if (!container) {
            console.error('Элемент scheduleContent не найден');
            return;
        }
        container.innerHTML = '';

        const selectedDay = this.currentDay || 'Monday';
        const lessons = this.filteredData[selectedDay] || [];
        console.log('Выбранный день:', selectedDay);
        console.log('Уроки для дня:', lessons);
        
        const dayNames = {
            'Monday': 'Понедельник',
            'Tuesday': 'Вторник', 
            'Wednesday': 'Среда',
            'Thursday': 'Четверг',
            'Friday': 'Пятница'
        };
        const dayCard = this.createDayCard(dayNames[selectedDay], lessons, selectedDay);
        container.appendChild(dayCard);

        this.highlightCurrentDay();
    }

    createDayCard(dayName, lessons, dayKey) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 fade-in';
        
        const sortedItems = this.sortItemsByTime(lessons);
        const lessonsCount = sortedItems.filter(item => !item.gap).length;
        const gapsCount = sortedItems.filter(item => item.gap).length;
        
        const isToday = this.isToday(dayKey);
        const todayClass = isToday ? 'border-primary border-2' : '';
        card.className += ` ${todayClass}`;
        
        const header = document.createElement('div');
        header.className = 'px-4 py-3 border-b border-gray-200 dark:border-gray-700';
        
        let headerText = `${lessonsCount} пар`;
        if (gapsCount > 0) {
            headerText += ` • ${gapsCount} окон`;
        }
        
        const currentTime = this.getCurrentTimeStatus(dayKey, lessons);
        
        header.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${dayName}${isToday ? ' (сегодня)' : ''}</h3>
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
                    <p>Пар нет</p>
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
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const sortedLessons = [...lessons].sort((a, b) => {
            const aTime = parseTime(a.time);
            const bTime = parseTime(b.time);
            return aTime.startMinutes - bTime.startMinutes;
        });
        
        for (let lesson of sortedLessons) {
            const lessonTime = parseTime(lesson.time);
            if (currentTime >= lessonTime.startMinutes && currentTime <= lessonTime.endMinutes) {
                return 'Сейчас идет';
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
                            Окно • ${gap.duration}
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
                        ${isCurrentLesson ? '<p class="text-xs text-primary font-medium mt-1">Сейчас идет</p>' : ''}
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
        
        if (dayBtn && !dayBtn.classList.contains('bg-primary')) {
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

    openSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        document.getElementById('reminderTime').value = this.reminderTime;
        document.getElementById('minGapMinutes').value = this.minGapMinutes;
        
        const thumb = document.getElementById('notificationThumb');
        const toggle = document.getElementById('notificationToggle');
        
        if (this.notificationsEnabled) {
            thumb.classList.add('translate-x-6');
            toggle.classList.add('bg-primary');
            toggle.classList.remove('bg-gray-200', 'dark:bg-gray-600');
        } else {
            thumb.classList.remove('translate-x-6');
            toggle.classList.remove('bg-primary');
            toggle.classList.add('bg-gray-200', 'dark:bg-gray-600');
        }
        
        const gapsThumb = document.getElementById('gapsThumb');
        const gapsToggle = document.getElementById('gapsToggle');
        
        if (this.showGaps) {
            gapsThumb.classList.add('translate-x-6');
            gapsToggle.classList.add('bg-primary');
            gapsToggle.classList.remove('bg-gray-200', 'dark:bg-gray-600');
        } else {
            gapsThumb.classList.remove('translate-x-6');
            gapsToggle.classList.remove('bg-primary');
            gapsToggle.classList.add('bg-gray-200', 'dark:bg-gray-600');
        }
        
        const calendarThumb = document.getElementById('calendarThumb');
        const calendarToggle = document.getElementById('calendarToggle');
        
        if (this.includeGapsInCalendar) {
            calendarThumb.classList.add('translate-x-6');
            calendarToggle.classList.add('bg-primary');
            calendarToggle.classList.remove('bg-gray-200', 'dark:bg-gray-600');
        } else {
            calendarThumb.classList.remove('translate-x-6');
            calendarToggle.classList.remove('bg-primary');
            calendarToggle.classList.add('bg-gray-200', 'dark:bg-gray-600');
        }
        
        const compactThumb = document.getElementById('compactThumb');
        const compactToggle = document.getElementById('compactToggle');
        
        if (this.compactMode) {
            compactThumb.classList.add('translate-x-6');
            compactToggle.classList.add('bg-primary');
            compactToggle.classList.remove('bg-gray-200', 'dark:bg-gray-600');
        } else {
            compactThumb.classList.remove('translate-x-6');
            compactToggle.classList.remove('bg-primary');
            compactToggle.classList.add('bg-gray-200', 'dark:bg-gray-600');
        }
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

    openInTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openTelegramLink('https://t.me/your_bot_username');
        } else {
            window.open('https://t.me/your_bot_username', '_blank');
        }
    }


    showQuickNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'notification fixed top-20 left-4 right-4 p-4 rounded-lg z-50 slide-in';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-semibold">${title}</h4>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
                <button class="text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }



    showWelcomeTips() {
        const hasSeenTips = localStorage.getItem('hasSeenTips');
        if (hasSeenTips) return;
        
        setTimeout(() => {
            this.showQuickNotification(
                'Добро пожаловать! 🎓',
                'Используйте кнопки дней недели для навигации'
            );
            
            setTimeout(() => {
                this.showQuickNotification(
                    'Совет 💡',
                    'Кликните на карточку занятия для подробной информации'
                );
            }, 3000);
            
            localStorage.setItem('hasSeenTips', 'true');
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScheduleApp();
});