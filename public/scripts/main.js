'use strict'

// ===========================
// VARIABLES AND CONSTANTS
// ===========================
// Will hold original JSON data
let data = null 
//Group By selected where:
// 0 = week, 1 = location, 2 = author
let groupType = 0
// Will hold grouped JSON data
let dataGrouped = [] 
// Store list of group by option to modify
let btnOptions = document.querySelectorAll(".option")
// Container where dynamic content will be display
let dynamicContent = document.getElementById("dynamic") 
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"]
// Keep track of the selected post to edit
let postIdx = 0;
// Modal with form
let modal = document.getElementById("modal")
// Element to display selected post ID on modal
let idField = document.getElementById("postId")
// Inputs fields for post data manipulation 
let authorField = document.getElementById("author")
let locationField = document.getElementById("location")
let textField = document.getElementById("textField")

// ===========================
// REQUEST TO GET DATA
// ===========================
async function GetJsonData() {
    const url = `${window.location.href}scripts/data.json`

    try {
      const response = await fetch(url)
      data = await response.json()

      // Perform group by when data is ready
      PerformGroup()
    } catch (error) {
      console.error('Error:', error)
    }
}


// ===========================
// GROUP BY LOGIC
// ===========================
function SelectOption(value) {
    if (groupType != value) {
        btnOptions[groupType].classList.remove("selected")
        groupType = value
        btnOptions[groupType].classList.add("selected")

        PerformGroup()
    }
}

function PerformGroup() {
    dataGrouped = [] // Clear array of grouped data
    dynamicContent.innerHTML = "" // Clean container

    // Check type of group to perform
    if (groupType == 0) {
        GroupByWeek()
    } else if (groupType == 1) {
        GroupByLocation()
    } else {
        GroupByAuthor()
    }

    // Create post content when data is grouped
    CreatePostContent()
}

function GroupByWeek() {
    // Iterate trougth json data
    for (const post of data) {
        // Store the date for easy usage
        // by using the GetDate utility function
        const date = GetDate(post.time)
        // We create a key name using the week #
        // and the date year
        const key = `Week ${date.week} - ${date.year}`
        
        // If no key found in our dictionary the key is created
        if (!dataGrouped[key]) {
            dataGrouped[key] = []
        }
        
        // Store the post data in the dictionary
        dataGrouped[key].push(post)
    }
}

function GroupByLocation() {
    // Iterate trougth json data
    for (const post of data) {
        // Store the location for easy usage
        const location = post.location

        // If no key found in our dictionary the key is created
        if (!dataGrouped[location]) {
            dataGrouped[location] = []
        }

        // Store the post data in the dictionary
        dataGrouped[location].push(post)
    }
}

function GroupByAuthor() {
    // Iterate trougth json data
    for (const post of data) {
         // Store the author for easy usage
        const author = post.author
        
        // If no key found in our dictionary the key is created
        if (!dataGrouped[author]) {
            dataGrouped[author] = []
        }

        // Store the post data in the dictionary
        dataGrouped[author].push(post)
    }
}

// ===========================
// DISPLAY JSON ON HTML
// ===========================
function CreatePostContent() {
    // Iterate trougth grouped data
    for (const [key, group] of Object.entries(dataGrouped)) {
        // Create a container for the group
        let container = document.createElement("div")
    
        // Create the group title
        let label = document.createElement("h4")
        label.textContent = key

        // Add the title on the group container
        container.appendChild(label)

        for (const post of group) {
            // Create the card container
            let card = document.createElement("div")
            card.className = "card"

            // Create the id label
            let id = document.createElement("p")
            id.textContent = `Post Id: ${post.id}`

            // Create the expand/collaps arrow icon
            let arrow = document.createElement("div")
            arrow.className = "card_arrow"

            // Create expandable/collapse container
            let expandable = document.createElement('div');
            expandable.className = "expandable"
    
            // Get the current post date data
            const date = GetDate(post.time)
    
            // Create location and date label
            let timeLocation = document.createElement("p")
            timeLocation.textContent = `${post.location}, ${date.monthStr} ${date.day}, ${date.year}`

            // Create text label
            let text = document.createElement("p")
            text.textContent = post.text
    
            // Create author label
            let author = document.createElement("p")
            author.textContent = post.author

            // Create tap area for toggle expand/collaps card state
            let tapArea = document.createElement("div")
            tapArea.className = "cta_expand"
            tapArea.addEventListener('click', ToggleCards)

            // Create tap area to edit post
            let tapEdit = document.createElement("div")
            tapEdit.className = "cta_edit"
            tapEdit.textContent = "Edit"
            tapEdit.addEventListener('click', function() {
                OpenEditModal(post.id)
            })
            

            // Add the arrow on ID label
            id.appendChild(arrow);
            // Add content to the expandable container
            expandable.appendChild(author)
            expandable.appendChild(timeLocation)
            expandable.appendChild(text)

            // Add all content on the card container
            card.appendChild(id)
            card.appendChild(expandable)
            card.appendChild(tapArea)
            card.appendChild(tapEdit)
    
            // Add card on group container
            container.appendChild(card)
        }

        // Add group container on dynamic container
        dynamicContent.appendChild(container)
    }
}

// ===========================
// UPDATE DATA LOGIC
// ===========================

function UpdateData() {

    if(IsValid(authorField) && IsValid(locationField) && IsValid(textField)) {
        data[postIdx].author = authorField.value
        data[postIdx].location = locationField.value
        data[postIdx].text = textField.value

        CloseModal()
        PerformGroup()
    }
}

function IsValid(elem) {
    if (elem.value == "") {
        elem.classList.add('empty');
        return false
    } else {
        return true
    }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function GetDate(value) {
    // Create a date object using the time
    // in milliseconds from JSON
    const date = new Date(value)

    // Return an object with all the important
    // values from the date 
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        monthStr: months[date.getMonth()], // Month in string
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        week: GetWeekNumber(date) // Get week number of date year
    }
}

function GetWeekNumber(date) {
    // Store the milliseconds a day have
    const dayMilliseconds = 86400000
    // Create a date for the first day of the given date year
    const janFirst = new Date(date.getFullYear(), 0, 1)
    // Get the difference to know the time passed in that year
    const  timeDif = date - janFirst
    
    // Calculate how many days pass in given year and divided by 7
    // to get the week number
    return Math.ceil((timeDif / dayMilliseconds + janFirst.getDay() + 1) / 7)
}

function ToggleCards(event) {
    // Add/remove selected class to the post cards to expand or collaps
    event.target.parentElement.classList.toggle("selected")
}

function OpenEditModal(id) {
    // Find index of the clicked post
    postIdx = data.findIndex((post) => post.id === id)
    // Display selected post ID
    idField.textContent = data[postIdx].id
    // Display selected post Author on input
    authorField.value = data[postIdx].author
    // Display selected post Location on input
    locationField.value = data[postIdx].location
    // Display selected post Text on textarea
    textField.value = data[postIdx].text

    // Add class to the modal, for fade in
    modal.classList.add("active")
}

function CloseModal() {
    modal.classList.remove("active")
    CleanInputs()
}

function CleanInputs() {
    // Remove the empty class for all inputs
    authorField.classList.remove('empty');
    locationField.classList.remove('empty');
    textField.classList.remove('empty');
}

// ===========================
// INITIALIZATION
// ===========================
function Init() {
    GetJsonData()
}

Init()