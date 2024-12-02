import CONFIG from '../utils/settings.js';

// Function to format the date to a "relative" time format (e.g., "3h ago")
function formatRelativeTime(dateString) {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000); // Difference in seconds

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Return relative time
    if (diffInYears > 0) {
        return `${diffInYears}y ago`;
    } else if (diffInMonths > 0) {
        return `${diffInMonths}m ago`;
    } else if (diffInDays > 0) {
        return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours}h ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes}m ago`;
    } else {
        return `${diffInSeconds}s ago`;
    }
}

// Hàm debounce để giảm số lần gọi API
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Hàm gọi API
async function searchRooms(query) {

    query = query.trim();

    const response = await fetch(`http://${CONFIG.BASE_URL}/api/rooms/room/room-active/?query=${query}`);
    const data = await response.json();

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    data.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.classList.add('card');
        roomCard.setAttribute('data-room-id', room.id); // Add the data-room-id attribute

        // Add the 'Join' button
        const joinButton = document.createElement('button');
        joinButton.classList.add('join-button');
        joinButton.innerText = 'Join';
        roomCard.appendChild(joinButton);

        // Create the card content
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        // Add room title and conditionally add lock icon for private rooms
        const roomTitle = document.createElement('h3');
        roomTitle.innerHTML = room.title;
        if (room.is_private) {
            roomTitle.innerHTML += ' <i class="fas fa-lock"></i>'; // Add lock icon for private rooms
        }
        cardContent.appendChild(roomTitle);

        // Add room creation time
        const cardTimer = document.createElement('div');
        cardTimer.classList.add('card-timer');
        const clockIcon = document.createElement('i');
        clockIcon.classList.add('fas', 'fa-clock');
        cardTimer.appendChild(clockIcon);
        const creationTime = document.createElement('span');
        creationTime.innerText = `${formatRelativeTime(room.created_at)}`; // Use relative time format
        cardTimer.appendChild(creationTime);
        cardContent.appendChild(cardTimer);

        // Add the tags (topics) of the room
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags');

        // Show only the first two tags
        const visibleTags = room.subjects.slice(0, 2); // Get the first two subjects
        visibleTags.forEach(subject => {
            const tag = document.createElement('span');
            tag.innerText = `${subject.name}`;
            tagsContainer.appendChild(tag);
        });

        // Only show the "..." if there are more than 2 tags
        if (room.subjects.length > 2) {
            const moreTags = room.subjects.slice(2); // Get the remaining subjects
            const moreTagSpan = document.createElement('span');
            moreTagSpan.innerText = '...';

            // Add hidden tags
            moreTags.forEach(subject => {
                const tag = document.createElement('span');
                tag.innerText = `${subject.name}`;
                tag.classList.add('hidden-tag'); // Initially hide these tags
                tagsContainer.appendChild(tag);
            });

            // Append the '...' and handle hover functionality
            tagsContainer.appendChild(moreTagSpan);

            // Add hover functionality to show more tags
            moreTagSpan.addEventListener('mouseenter', () => {
                const hiddenTags = tagsContainer.querySelectorAll('.hidden-tag');
                hiddenTags.forEach(tag => tag.style.display = 'inline-block'); // Show the hidden tags
            });

            moreTagSpan.addEventListener('mouseleave', () => {
                const hiddenTags = tagsContainer.querySelectorAll('.hidden-tag');
                hiddenTags.forEach(tag => tag.style.display = 'none'); // Hide the hidden tags again
            });
        }

        // Append the tags container to the card content
        cardContent.appendChild(tagsContainer);


        // Append card content to the room card
        roomCard.appendChild(cardContent);

        // Create and append the card footer (showing members count)
        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer');
        const memberCount = document.createElement('span');
        memberCount.innerText = room.members;
        cardFooter.appendChild(memberCount);
        const usersIcon = document.createElement('i');
        usersIcon.classList.add('fas', 'fa-users');
        cardFooter.appendChild(usersIcon);
        roomCard.appendChild(cardFooter);

        // Add the room card to the card container
        document.querySelector('.card-container').appendChild(roomCard);
    });
}

// Sự kiện khi người dùng gõ vào thanh tìm kiếm
document.getElementById('search-input').addEventListener('input', debounce(function (event) {
    searchRooms(event.target.value);
}, 500)); // 500ms delay trước khi gọi API

window.onload = function () {
    // You can either call it with an empty string or a specific query, for example:
    searchRooms('');
};

// Function to fetch room data from the API and display it on the page
// function fetchRoomData() {
//     // Define the API endpoint
//     const apiUrl = 'http://192.168.1.15:8000/api/rooms/room/room-active';

//     // Fetch data from the API
//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             // Assuming we have a room data array, process each room
//             data.forEach(room => {
//                 // Create the card for each room dynamically
//                 const roomCard = document.createElement('div');
//                 roomCard.classList.add('card');
//                 roomCard.setAttribute('data-room-id', room.id); // Add the data-room-id attribute

//                 // Add the 'Join' button
//                 const joinButton = document.createElement('button');
//                 joinButton.classList.add('join-button');
//                 joinButton.innerText = 'Join';
//                 roomCard.appendChild(joinButton);

//                 // Create the card content
//                 const cardContent = document.createElement('div');
//                 cardContent.classList.add('card-content');

//                 // Add room title and conditionally add lock icon for private rooms
//                 const roomTitle = document.createElement('h3');
//                 roomTitle.innerHTML = room.title;
//                 if (room.is_private) {
//                     roomTitle.innerHTML += ' <i class="fas fa-lock"></i>'; // Add lock icon for private rooms
//                 }
//                 cardContent.appendChild(roomTitle);

//                 // Add room creation time
//                 const cardTimer = document.createElement('div');
//                 cardTimer.classList.add('card-timer');
//                 const clockIcon = document.createElement('i');
//                 clockIcon.classList.add('fas', 'fa-clock');
//                 cardTimer.appendChild(clockIcon);
//                 const creationTime = document.createElement('span');
//                 creationTime.innerText = `${formatRelativeTime(room.created_at)}`; // Use relative time format
//                 cardTimer.appendChild(creationTime);
//                 cardContent.appendChild(cardTimer);

//                 // Add the tags (topics) of the room
//                 const tagsContainer = document.createElement('div');
//                 tagsContainer.classList.add('tags');

//                 // Show only the first two tags
//                 const visibleTags = room.subjects.slice(0, 2); // Get the first two subjects
//                 visibleTags.forEach(subject => {
//                     const tag = document.createElement('span');
//                     tag.innerText = `${subject.name}`;
//                     tagsContainer.appendChild(tag);
//                 });

//                 // Show remaining tags when hover over '...'
//                 const moreTags = room.subjects.slice(2); // Get the remaining subjects
//                 const moreTagSpan = document.createElement('span');
//                 moreTagSpan.innerText = '...';
//                 moreTags.forEach(subject => {
//                     const tag = document.createElement('span');
//                     tag.innerText = `${subject.name}`;
//                     tag.classList.add('hidden-tag'); // Initially hide these tags
//                     tagsContainer.appendChild(tag);
//                 });
//                 tagsContainer.appendChild(moreTagSpan);

//                 // Add hover functionality to show more tags
//                 moreTagSpan.addEventListener('mouseenter', () => {
//                     const hiddenTags = tagsContainer.querySelectorAll('.hidden-tag');
//                     hiddenTags.forEach(tag => tag.style.display = 'inline-block'); // Show the hidden tags
//                 });
//                 moreTagSpan.addEventListener('mouseleave', () => {
//                     const hiddenTags = tagsContainer.querySelectorAll('.hidden-tag');
//                     hiddenTags.forEach(tag => tag.style.display = 'none'); // Hide the hidden tags again
//                 });

//                 cardContent.appendChild(tagsContainer);


//                 // Append card content to the room card
//                 roomCard.appendChild(cardContent);

//                 // Create and append the card footer (showing members count)
//                 const cardFooter = document.createElement('div');
//                 cardFooter.classList.add('card-footer');
//                 const memberCount = document.createElement('span');
//                 memberCount.innerText = room.members;
//                 cardFooter.appendChild(memberCount);
//                 const usersIcon = document.createElement('i');
//                 usersIcon.classList.add('fas', 'fa-users');
//                 cardFooter.appendChild(usersIcon);
//                 roomCard.appendChild(cardFooter);

//                 // Add the room card to the card container
//                 document.querySelector('.card-container').appendChild(roomCard);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching room data:', error);
//         });
// }

// Call the function to fetch and display room data when the page loads
// window.onload = fetchRoomData;
