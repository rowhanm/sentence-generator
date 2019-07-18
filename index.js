function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*
    Author - %%aut%%
    Location - %%loc%%
    Person - %%per%%
*/

//Populate this table from reading the csv in the app
let sentences = {
    "Arts and photography": [""],
    "Biographies and memoirs": ["%%per%% was one of the greats. Read more about him now! 🔥"],
    "Business and investing": ["To create wealth, Warren Buffett thinks you have to read books by %%aut%% 🔥"],
    "Children's books": ["Find out what %%per%% and friends are up to today. Read now! 🔥🔥"],
    "Cookbooks, food and wine": ["Every great meal comes from a great recipe. %%aut%% has quite a few of them. Read now! 🔥🔥"],
    "History": ["\"%%aut%% is the best historian ever\" - Gandhi"],
    "Literature and Fiction": ["%%per%% wants you to read now! 🔥🔥"],
    "Mystery and suspense": ["\"I\'m so scared! Please read to save me!\" - %%per%%"],
    "Romance": ["Man, isnt love a strange thing. %%per%% definitely thinks so!"],
    "Sci-Fi and Fantasy": ["%%loc%% is one of the most interesting places in pop culture. Read more to see whats happening there! 🔥🔥"],
    "Teens and young adults": ["Check out what %%per%% is upto in %%loc%% 🔥🔥"],
    "Default": ["yes, this is a default notification. who said default cant be funny"]
}

function getSentence(category, author, person, location) {
    let sentenceToEdit = sentences[category][Math.floor(Math.random()*(sentences[category]).length)];
    if (sentenceToEdit.indexOf("%%aut%%") >= 0) {
        sentenceToEdit = sentenceToEdit.replace(/%%aut%%/gi, author);
    }
    if (sentenceToEdit.indexOf("%%per%%") >= 0) {
        sentenceToEdit = sentenceToEdit.replace(/%%per%%/gi, person);
    }
    if (sentenceToEdit.indexOf("%%loc%%") >= 0) {
        sentenceToEdit = sentenceToEdit.replace(/%%loc%%/gi, location);
    }
    return sentenceToEdit;
}

var myFunction = function () {
    $('#results').empty();
    let bookName = "";
    let author = "";
    var x = document.getElementById("frm1");
    bookName = x.elements[0].value;
    author = x.elements[1].value;
    bookName=bookName.replace(/ /g,"+");
    author=author.replace(/ /g,"+");

    var client = new HttpClient();
    client.get('https://www.googleapis.com/books/v1/volumes?q=' + bookName + "+" + author + '&orderBy=relevance&langRestrict=en', function(response) {
        let books = JSON.parse(response).items;
        books = books.slice(0,1);
        books.forEach(element => {
            var newDiv = document.createElement("div");
            newDiv.style.display = 'flex';
            newDiv.style.flexDirection = 'row';

            var newDivImage = document.createElement("div");
            var image = document.createElement("img");
            image.setAttribute("height", "300");
            image.setAttribute("width", "200");
            image.style.margin = "1%"; 
            image.src = element.volumeInfo.imageLinks.thumbnail;
            newDivImage.appendChild(image);
            newDiv.appendChild(newDivImage);


            var xhr = new XMLHttpRequest();
            var url = "http://localhost:4000";
            var data = JSON.stringify({"bookName": bookName, "author": author});
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function (data, status, xhr) {
                    console.log(JSON.stringify(data));
                    var content = document.createElement("div");
                    content.style.margin = "1%";
                    content.style.alignItems = 'center';
                    var title = document.createElement("div");
                    var category = document.createElement("div");
                    var author = document.createElement("div");
                    var gbooks = document.createElement("div");
                    var persons = document.createElement("div");
                    var locs = document.createElement("div");
                    if ("title" in data) {
                        title.innerHTML += "Title: " + data.title;
                    }
                    if ("categories" in element.volumeInfo) {
                        gbooks.innerHTML += "GBooks category: " + element.volumeInfo.categories[0];
                    }
                    if ("category" in data) {
                        category.innerHTML += "Category: " + data.category;
                    }
                    if ("author" in data) {
                        author.innerHTML += "Author: " + data.author;
                    }
                    if ("persons" in data) {
                        persons.innerHTML += "Persons: " + data.persons;
                    }
                    if ("locationsAndGPE" in data) {
                        locs.innerHTML += "Locations: " + data.locationsAndGPE;
                    }
                    content.appendChild(title);
                    content.appendChild(category);
                    content.appendChild(gbooks);
                    content.appendChild(author);
                    content.appendChild(persons);
                    content.appendChild(locs);
                    content.style.borderStyle = "groove";
                    newDiv.appendChild(content);
                    var notifications = document.createElement("div");
                    notifications.style.margin = "1%";
                    notifications.style.alignItems = 'center';
                    var sen1 = document.createElement("div");
                    if (data.locationsAndGPE.length === 0) {
                        data.locationsAndGPE.push("in the book");
                    }
                    if (data.persons.length === 0) {
                        data.persons.push(data.author);
                    }
                    if (!data.category) {
                        sen1.innerHTML += getSentence("Default", data.author, data.persons[Math.floor(Math.random()*data.persons.length)], data.locationsAndGPE[0]);
                    }
                    sen1.innerHTML += getSentence(data.category, data.author, data.persons[Math.floor(Math.random()*data.persons.length)], data.locationsAndGPE[0]);
                    notifications.appendChild(sen1);
                    notifications.style.borderStyle = "ridge";
                    newDiv.appendChild(notifications);
                },
                dataType: "json",
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    var content = document.createElement("div");
                    content.style.margin = "1%";
                    content.style.alignItems = 'center';
                    var title = document.createElement("div");
                    title.innerHTML += "Could not fetch google books metadata";
                    content.appendChild(title);
                    content.style.borderStyle = "groove";
                    newDiv.appendChild(content);
                    var notifications = document.createElement("div");
                    notifications.style.margin = "1%";
                    notifications.style.alignItems = 'center';
                    var sen1 = document.createElement("div");
                    sen1.innerHTML += getSentence("Default", "", "", "");
                    notifications.appendChild(sen1);
                    notifications.style.borderStyle = "ridge";
                    newDiv.appendChild(notifications);
                }  
            });
            document.getElementById("results").appendChild(newDiv);

        });
        // do something with response
    });
    
}

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}
