document.addEventListener('DOMContentLoaded', () => {

    // --- Header and Navigation ---
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            navLinks.forEach((link, index) => {
                link.style.animation ? link.style.animation = '' : link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            });
            burger.classList.toggle('toggle');
        });
    };
    navSlide();

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.querySelector('.nav-links');
            const burger = document.querySelector('.burger');
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            document.querySelectorAll('.nav-links li').forEach(item => item.style.animation = '');
        });
    });

    // --- Admin Panel & API Communication ---
    const API_URL = 'http://localhost:3000/api';
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminPanel = document.getElementById('adminPanel');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginError = document.getElementById('adminLoginError');
    const eventManagementSection = document.getElementById('eventManagementSection');
    const addEventForm = document.getElementById('addEventForm');
    const eventGrid = document.getElementById('eventGrid');
    const currentEventsList = document.getElementById('currentEventsList');
    
    // Fetch and render events from the backend
    const fetchEvents = async () => {
        try {
            const response = await fetch(`${API_URL}/events`);
            const events = await response.json();
            renderEvents(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            eventGrid.innerHTML = '<p>Error loading events. Please try again later.</p>';
        }
    };

    const renderEvents = (events) => {
        eventGrid.innerHTML = '';
        currentEventsList.innerHTML = '';
        if (events.length === 0) {
            eventGrid.innerHTML = '<p>No events to display.</p>';
            currentEventsList.innerHTML = '<li>No events to display.</li>';
            return;
        }
        events.sort((a, b) => new Date(b.date) - new Date(a.date));
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            const eventDateFormatted = new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <div class="event-details">
                    <p><i class="fas fa-calendar-alt"></i> ${eventDateFormatted}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${event.venue}</p>
                </div>
                <p>${event.description}</p>
            `;
            eventGrid.appendChild(eventCard);

            const adminEventItem = document.createElement('li');
            adminEventItem.innerHTML = `<span>${event.name} - ${eventDateFormatted}</span><button class="delete-btn" data-id="${event.id}">Delete</button>`;
            currentEventsList.appendChild(adminEventItem);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const eventId = parseInt(e.target.dataset.id);
                try {
                    await fetch(`${API_URL}/events/${eventId}`, { method: 'DELETE' });
                    fetchEvents();
                } catch (error) { console.error('Error deleting event:', error); }
            });
        });
    };

    fetchEvents();

    adminLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adminPanel.style.display = 'flex';
    });

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        if (username === 'admin' && password === 'admin123') {
            adminLoginForm.style.display = 'none';
            eventManagementSection.style.display = 'block';
            adminLoginError.style.display = 'none';
        } else {
            adminLoginError.style.display = 'block';
        }
    });

    addEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newEvent = {
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            venue: document.getElementById('eventVenue').value,
            description: document.getElementById('eventDescription').value,
            type: document.getElementById('eventType').value,
        };
        try {
            await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent),
            });
            addEventForm.reset();
            fetchEvents();
        } catch (error) { console.error('Error adding event:', error); }
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const contactData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value,
            };
            try {
                await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contactData),
                });
                alert('Your message has been sent successfully!');
                contactForm.reset();
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Failed to send message. Please try again.');
            }
        });
    }

});
