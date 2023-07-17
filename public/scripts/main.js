'use strict'

// ===========================
// VARIABLES AND CONSTANTS
// ===========================
// Will hold original JSON data
let data = null 
//Group By selected where:
// 0 = week, 1 = location, 2 = author
let groupType = 1 
// Will hold grouped JSON data
let dataGrouped = [] 
// Container where dynamic content will be display
let dynamicContent = document.getElementById("dynamic") 


// ===========================
// REQUEST TO GET DATA
// ===========================
async function GetJsonData() {
    const url = `${window.location.href}scripts/data.json`

    try {
      const response = await fetch(url)
      data = await response.json()
      console.log(data)
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
    // TO-DO
}

function GroupByLocation() {
    // Iterate trougth json data
    for (const post of data) {
        // We store the location for easy usage
        const location = post.location

        // If no key on our dictionary is found
        // we create the key
        if (!dataGrouped[location]) {
            dataGrouped[location] = []
        }

        // We store the post data in the dictionary
        dataGrouped[location].push(post)
    }

    console.log(dataGrouped)
}

function GroupByAuthor() {
    // TO-DO
}

// ===========================
// INITIALIZATION
// ===========================
function Init() {
    console.log('Script Init')
    GetJsonData()
}

Init()