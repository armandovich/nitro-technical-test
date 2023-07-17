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
      console.log(data)
      
      // Perform group by when data is ready
      PerformGroup()
    } catch (error) {
      console.error('Error:', error)
    }
}

// ===========================
// GROUP BY LOGIC
// ===========================
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

    console.log(dataGrouped)
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

    console.log(dataGrouped)
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

    console.log(dataGrouped)
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
    console.log('Script Init')
    GetJsonData()
}

Init()