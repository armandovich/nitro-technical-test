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
    for (const [key, group] of Object.entries(dataGrouped)) {
        let container = document.createElement("div")
    
        let label = document.createElement("h4")
        label.textContent = key

        container.appendChild(label)

        for (const post of group) {
            let card = document.createElement("div")
            card.className = "card"

            let id = document.createElement("p")
            id.textContent = `Post Id: ${post.id}`

            let arrow = document.createElement("div")
            arrow.className = "card_arrow"

            let expandable = document.createElement('div');
            expandable.className = "expandable"

            let location = document.createElement("p")
            location.textContent = post.location
    
            const date = GetDate(post.time)
    
            let timeLocation = document.createElement("p")
            timeLocation.textContent = `${post.location}, ${date.monthStr} ${date.day}, ${date.year}`
            timeLocation.id = `card_location_${post.id}`

            let text = document.createElement("p")
            text.textContent = post.text
            text.id = `card_text_${post.id}`
    
            let author = document.createElement("p")
            author.textContent = post.author
            author.id = `card_author_${post.id}`

            id.appendChild(arrow);
            expandable.appendChild(author)
            expandable.appendChild(timeLocation)
            expandable.appendChild(text)

            card.appendChild(id)
            card.appendChild(expandable)
    
            container.appendChild(card)
        }

        dynamicContent.appendChild(container)
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

// ===========================
// INITIALIZATION
// ===========================
function Init() {
    GetJsonData()
}

Init()