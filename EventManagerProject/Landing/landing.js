// Configuration
const API_ENDPOINT = 'http://localhost:8080/api/event/events';
const MAX_EVENTS = 3;

// DOM Elements
const loadingElement = document.getElementById('loading');
const noEventsElement = document.getElementById('noEvents');
const eventsContainer = document.getElementById('eventsContainer');
const showMoreContainer = document.getElementById('showMoreContainer');
const exampleEventsSection = document.getElementById('exampleEventsSection');

// Fixed Example Events
const EXAMPLE_EVENTS = [
    {
        id: 'example-1',
        title: "Annual Tech Conference",
        description: "Join industry leaders for insights into the latest technology trends",
        date: "2024-06-15",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
    },
    {
        id: 'example-2',
        title: "Music & Arts Festival",
        description: "A celebration of culture with live performances and art exhibitions",
        date: "2024-07-20",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
    },
    {
        id: 'example-3',
        title: "Food & Wine Expo",
        description: "Experience culinary delights from around the world",
        date: "2024-08-10",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
    }
];

// Helper Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function createEventCard(event) {
    // Check if this is an example event
    const isExampleEvent = event.id?.toString().includes('example');
    
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden ${isExampleEvent ? '' : 'cursor-pointer hover:shadow-xl transition-shadow duration-300'}" 
             ${isExampleEvent ? '' : `onclick="window.location.href='../Events/event.html?id=${event.event_Id}'"`}>
            <img src="${event.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'}" 
                 alt="${event.event_name || event.title}" 
                 class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">${event.event_name || event.title}</h3>
                
                <div class="flex items-center text-gray-500">
                    <i class="far fa-calendar mr-2"></i>
                    <span>${formatDate(event.dateTime || event.date)}</span>
                </div>
                ${isExampleEvent ? '<div class="mt-2 text-sm text-gray-500">(Example Event)</div>' : ''}
            </div>
        </div>
    `;
}

function showLoading() {
    loadingElement.classList.remove('hidden');
    noEventsElement.classList.add('hidden');
    eventsContainer.classList.add('hidden');
    showMoreContainer.classList.add('hidden');
    exampleEventsSection.classList.add('hidden');
}

function showNoEvents() {
    loadingElement.classList.add('hidden');
    noEventsElement.classList.remove('hidden');
    eventsContainer.classList.add('hidden');
    showMoreContainer.classList.add('hidden');
    exampleEventsSection.classList.remove('hidden');

    // Render example events
    const exampleEventsContainer = document.getElementById('exampleEventsContainer');
    if (exampleEventsContainer) {
        exampleEventsContainer.innerHTML = EXAMPLE_EVENTS.map(createEventCard).join('');
    }
}

function showEvents(events) {
    loadingElement.classList.add('hidden');
    noEventsElement.classList.add('hidden');
    eventsContainer.classList.remove('hidden');
    showMoreContainer.classList.remove('hidden');
    exampleEventsSection.classList.add('hidden');

    const eventsToShow = events.slice(0, MAX_EVENTS);
    eventsContainer.innerHTML = eventsToShow.map(createEventCard).join('');
}

async function fetchAndDisplayEvents() {
    showLoading();

    try {
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const events = await response.json();

        if (events.length === 0) {
            showNoEvents();
            return;
        }

        showEvents(events);

    } catch (error) {
        console.error('Error fetching events:', error);
        showNoEvents();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector("nav");
    const navItems = nav.querySelectorAll(".nav-item");

    navItems.forEach((item, idx) => {
        item.style.setProperty("--i", idx);
        item.addEventListener("mouseleave", () => nav.style.setProperty("--enter-nav", 0));
        item.addEventListener("mousemove", (e) => {
            let { clientX: x, clientY: y } = e;
            const rect = item.getBoundingClientRect();
            x = ((x - rect.x) - (rect.width / 2)) / rect.width;
            y = ((y - rect.y) - (rect.height / 2)) / rect.height;

            nav.style = `
                --enter-nav: 1;
                --current-item: ${idx};
                --x: ${x};
                --y: ${y}; 
            `;
        });
    });
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayEvents);

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        // User is not logged in, redirect to login page
        window.location.href = '../Login/login.html';
    }
}

// Run this when page loads
checkAuth();