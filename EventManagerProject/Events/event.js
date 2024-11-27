// Configuration
const API_ENDPOINT = 'http://localhost:8080/api/event/event';

// DOM Elements
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const eventDetailsContainer = document.getElementById('eventDetails');

// Helper Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function fetchEventDetails() {
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId) {
        showError('Event ID not found');
        return;
    }

    try {
        const response = await fetch(`${API_ENDPOINT}${eventId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch event details');
        }

        const event = await response.json();
        displayEventDetails(event);

    } catch (error) {
        console.error('Error fetching event details:', error);
        showError('Unable to load event details');
    }
}

function displayEventDetails(event) {
    // Hide loading and show details
    loadingElement.classList.add('hidden');
    errorMessage.classList.add('hidden');
    eventDetailsContainer.classList.remove('hidden');

    // Update page title
    document.title = `${event.event_name} - Event Details`;

    // Update DOM elements
    document.getElementById('eventImage').src = event.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819';
    document.getElementById('eventImage').alt = event.event_name;
    document.getElementById('eventTitle').textContent = event.event_name;

    // Split datetime into date and time
    const dateTimeObj = new Date(event.dateTime);
    const formattedDate = formatDate(dateTimeObj);
    const formattedTime = dateTimeObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('eventDate').textContent = formattedDate;
    document.getElementById('eventTime').textContent = formattedTime || 'TBA';

    document.getElementById('eventLocation').textContent = event.event_location || 'TBA';
    document.getElementById('eventDescription').textContent = event.event_description;

    // Update organizer info
    document.getElementById('organizerInfo').innerHTML = `
        <p class="mb-2"><strong>Name:</strong> ${event.organizer?.name || 'Vibhor'}</p>
        <p class="mb-2"><strong>Email:</strong> ${event.organizer?.email || 'xyz@gmail.com'}</p>
        <p><strong>Phone:</strong> ${event.organizer?.phone || '1234567890'}</p>
    `;

    // Update event details
    const detailsList = document.getElementById('eventDetailsList');
    if (detailsList) {
        detailsList.innerHTML = `
            <li><strong>Category:</strong> ${event.category || 'General'}</li>
            <li><strong>Capacity:</strong> ${event.capacity || 'Unlimited'}</li>
            <li><strong>Price:</strong> ${event.price ? `$${event.price}` : 'Free'}</li>
            ${event.additionalDetails ? `<li>${event.additionalDetails}</li>` : ''}
        `;
    }
}

function showError(message) {
    loadingElement.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    eventDetailsContainer.classList.add('hidden');
    errorMessage.querySelector('p').textContent = message;
}

// Initialize page
document.addEventListener('DOMContentLoaded', fetchEventDetails);

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        // User is not logged in, redirect to login page
        window.location.href = '../Login/login.html';
    }
}

// Run this when page loads
checkAuth();