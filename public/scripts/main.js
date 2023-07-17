'use strict'

let data = null;

async function GetJsonData() {
    const url = `${window.location.href}scripts/data.json`;

    try {
      const response = await fetch(url);
      data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

function Init() {
    console.log('Script Init')
    GetJsonData()
}

Init();