// Main Goal :
// Gets User's Input and Research for news about the Input (Company, ticker ...)
// Create variable to store the btn element
var btnSearch = document.getElementById("btnSearch")
// Create variable to store the user's input
var usersInput = document.getElementById("usersInput")

// iframe with loading animation to show while searching
const loader = document.querySelector("#gettingDataAnim");
// Get the user's input
// Create the showValue function
const showValue = () => {
  	// Show searching animation
  	loader.classList.remove("hidden");
  	// Check if the input is empty (remove all white spaces with trim() method)
  	if (usersInput.value.trim().length === 0) {
    	console.log("You did not type any input. Please add a search criteria before clicking the button");
  	} else {
    	// Create a variable to save the endpoint URL
    	const endpointUrl = `https://bloomberg-market-and-financial-news.p.rapidapi.com/market/auto-complete?query=${usersInput.value}`;
		console.log(usersInput.value);
		console.log(endpointUrl);
		// Get data from API's endpoint
		getDatafromEndPoint(endpointUrl);
  	}
};

// Create a function to make a request to the server using XMLHttpRequest Object
const getDatafromEndPoint = (url) => {
	const data = null;
	// Create an instance of the XMLHttpRequest Object
	const xhr = new XMLHttpRequest();
	// Add event listener to track the progress of the request
	//** You need to add the event listeners before calling open() on the request. Otherwise the progress events will not fire
	xhr.addEventListener("progress", updateProgress);
	// Initialize the request with the open() method
	// Note: If we dont specify the 3rd arg the default is true = async
	xhr.open("GET", url, true);

	xhr.onload = function () {
		loader.classList.add("hidden");
		if (this.status == 200) {
			console.log("Request succeeded. The resource has been fetched and transmitted in the message body");
			var result = JSON.parse(this.response);
			console.log(result);
			console.log(result.news);
			// Call Function to display all news
			displayAllNews(result.news);
		} else {
			console.log("Server did not respond");
		}
	};
	// Bloomberg API - requires Authorization to be sent
	xhr.setRequestHeader("X-RapidAPI-Key", config.XRK);
	xhr.setRequestHeader("X-RapidAPI-Host", config.XRHOST);

	// Sending the request
	xhr.send(data);
};

// On progress function
const updateProgress = (event) => {
  	// best practice since we dont want the event to be infinite
  	const percentComplete = (event.loaded / event.total) * 100;
  	console.log(percentComplete);
};

// Create Function to Display all NEWS
const displayAllNews = (allNews) => {
	// if there was any news as response 
  	if (allNews.length !== 0) {
		document.getElementById("feed").innerHTML = ""
		allNews.forEach((oneNews) => {
			// append Info news.title news.longURL
			const newsCard = document.createElement("div")
			const newsDate = document.createElement("span")
			const newsP = document.createElement("p")
			const newsLink = document.createElement("a")
			// Add styles class to the div container
			newsCard.classList.add("border-2", "bg-slate-100", "p-5", "text-left", "rounded-tr-[25px]", "mt-4", "hover:border-indigo-800", "hover:cursor-pointer", "transition", "delay-150", "duration-300", "ease-in-out")
			// Add styles class to the date's span
			newsDate.classList.add("text-indigo-600")
			// Add styles class to the paragraph
			newsP.classList.add("text-left")
			// Add styles class to the Link
			newsLink.classList.add("font-bold", "underline", "underline-offset-8", "hover:text-indigo-800")
			// Add content to the paragraph
			newsP.innerHTML = oneNews.title
			// Add content to the Link
			newsLink.innerHTML = oneNews.longURL
			// Add content to the Date
			newsDate.innerHTML = new Date(1000 * oneNews.date).toDateString()
			// Add the src to the Link
			newsLink.href = oneNews.longURL
			// Add the target to the Link
			newsLink.target = "_blank"
			newsCard.appendChild(newsDate)
			newsCard.appendChild(newsP)
			newsCard.appendChild(newsLink)
			document.getElementById("feed").appendChild(newsCard)
		});
  	} else {
    	// did not find any results
    	const notFoundMsg = "Nothing was found. Please search for a different criteria"
    	document.getElementById("feed").innerHTML = "<p>" + notFoundMsg + "</p>"
  	}
};

// Create a Function to clear the Input when user clicks on it
const clearValue = () => {usersInput.value = ""}

// Adding extra functionality
// Execute a function when the user presses a key on the keyboard
usersInput.addEventListener("keypress", function (event) {
  	// If the user presses the "Enter" key on the keyboard
  	if (event.key === "Enter") {
    	// Cancel the default action, if needed
    	event.preventDefault()
    	// Trigger the button element with a click
    	btnSearch.click()
  	}
});

btnSearch.onclick = showValue
usersInput.onclick = clearValue
