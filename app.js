console.log("Hello!");

//*********************************************************************** 
// 
//*********************************************************************** 
const form = document.querySelector("form");
const imgUrlInput = document.getElementById("img-url-input");
const topTextInput = document.getElementById("top-text-input");
const bottomTextInput = document.getElementById("bottom-text-input");
const memeDisplayArea = document.querySelector("#meme-display-area");
let memes = [];



//*********************************************************************** 
// This function is run only when web page is first loaded or browser
// refresh is loaded. 
// Initializes key elements of the app at start up (e.g., retrieves memes 
// from localStorage)
//*********************************************************************** 
function init() {
  // Retrieve any Memes from local storage
  memes = JSON.parse(localStorage.getItem("memes"));
  if (memes === null || memes.length === 0) {
    memes = [];
  } else {
   // Build HTML for Memes found in local storage and insert them into UI 
   rebuildMemesFromLocalStorage(memes);
  }
 }

//*********************************************************************** 
// Regenerates meme elements from memes in local storage and adds them to
// UI.
// Called by app's init function when Memes found in localstorage 
//*********************************************************************** 
function rebuildMemesFromLocalStorage(memes) {
  memes.forEach(meme => {
    buildMemeHtmlAddToUI(meme);
  });
 }

//*********************************************************************** 
// Runs the init function only after ALL app resources (e.g.,HTML, 
// Scripts, CSS, etc) have been loaded after initial page load or 
// upon broswser page refresh
//***********************************************************************
window.addEventListener('load', function() {
  console.log('All assets are loaded')
  init(); // Perform initial setup for app
})

//*********************************************************************** 
// Check to see if user input was not filled in or contains all blanks 
//*********************************************************************** 
function isEmpty(str) {
  return !str.trim().length;
}

//*********************************************************************** 
// Constructor function for Meme
//*********************************************************************** 
function Meme (id, url, topText, bottomText) {
  this.id = id;
  this.url = url;
  this.topText = topText;
  this.bottomText = bottomText;
}

//*********************************************************************** 
// Generate a unique id as a key for each todo for other update operations 
// (i.e.,update, delete, etc)
//*********************************************************************** 
function createId () {
  let date = new Date();
  return date.getTime(); 
}


//*********************************************************************** 
// Synchronize local Memes array and local storage Memes array so as to
// ensure consistency between the two at all times
//*********************************************************************** 
function deleteMemeRecord (id) {
  memes.forEach(function (meme, index) {
    if (meme.id === parseInt(id)) {
         memes.splice(index, 1);
    }
  });
  return memes
 
}

//*********************************************************************** 
// 
//*********************************************************************** 
function buildMemeHtmlAddToUI(meme) {
  // Create all HTML elements needed to hold Todo elements
  
  // Build outer meme div
  let memeHolderDivElement = document.createElement("DIV");
  memeHolderDivElement.classList.add("memeHolder");

  // Build div that holds mem values
  let memeDivElement = document.createElement("DIV");
  memeDivElement.classList.add("meme");
  memeDivElement.dataset.id = meme.id;
 

  // Build Top Text Div and append and append to Meme Div
  if (!isEmpty(meme.topText)) {
    let topMemeTextElement = document.createElement("DIV");
    topMemeTextElement.classList.add("top-meme-text", "meme-text");
    topMemeTextElement.innerText = meme.topText;
    memeDivElement.appendChild(topMemeTextElement);
  }

  // Build Bottom Text Div and append to Meme Div
  if (!isEmpty(meme.bottomText)) {
    let bottomMemeTextElement = document.createElement("DIV");
    bottomMemeTextElement.classList.add("bottom-meme-text", "meme-text");
    bottomMemeTextElement.innerText = meme.bottomText;
    memeDivElement.appendChild(bottomMemeTextElement);
  }
  // Create Overlay and Delete Button elements and append to Meme Div
  // Build Overlay Div
  let overlayForDeleteButton = document.createElement('DIV'); 
  overlayForDeleteButton.classList.add("overlay");

  // Build Delete Button & Span child element
  let memeDeleteButton = document.createElement('DIV');
  memeDeleteButton.classList.add("button");
  let memeDeleteButtonSpan = document.createElement('SPAN');
  memeDeleteButtonSpan.innerText = "X";
  memeDeleteButton.appendChild(memeDeleteButtonSpan);

  // Append the Overalay and Delete button to Meme Div
  memeDivElement.appendChild(overlayForDeleteButton); 
  memeDivElement.appendChild(memeDeleteButton); 

  // Build img element for meme and append to Meme Div
  memeUrlElement = document.createElement("IMG");
  memeUrlElement.setAttribute("src",meme.url);
  memeDivElement.appendChild(memeUrlElement); 

  // Add Meme div to Meme container
  memeHolderDivElement.appendChild(memeDivElement);

  //Add the Meme Divs and content to the UI
  memeDisplayArea.appendChild(memeHolderDivElement);
  console.log(memeHolderDivElement);
}
//*********************************************************************** 
// Check to see if user input was not filled in or contains all blanks 
//*********************************************************************** 
form.addEventListener("submit", function(e){
  e.preventDefault();
  let memeImgUrl = imgUrlInput.value.trim();
  if ( !isEmpty(memeImgUrl) ) {
    let memeTopText = topTextInput.value.trim();
    let memeBottomText = bottomTextInput.value.trim();
    imgUrlInput.value = "";
    topTextInput.value = "";
    bottomTextInput.value=""; 
    let memeId = createId();
    // Create Meme object 
    let meme = new Meme(memeId, memeImgUrl, memeTopText, memeBottomText);
    memes.push(meme); 
    console.log(meme);
    buildMemeHtmlAddToUI(meme);
    localStorage.setItem("memes", JSON.stringify(memes));
  } else { 
    alert("ERROR ---> Image URL field cannont be blank.");
  }
})

memeDisplayArea.addEventListener('click', function(e) {
  console.log(e.target);
  if (e.target.className === "meme") {
    let clickedMeme = e.target;
    let memeId = clickedMeme.dataset.id;

    // Delete the Todo from the UI
    clickedMeme.parentElement.remove();

    // Remove Meme object from in memory Meme object
    memes = deleteMemeRecord(memeId);

    // Synchronize local starage to match in memory Meme object
    localStorage.setItem("memes", JSON.stringify(memes));
  }
  
})

