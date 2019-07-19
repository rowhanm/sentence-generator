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
    "Arts and photography": ["Great artists like %%aut%% think reading is the first step to creating great art. Read now. 🔥", "%%aut%% got to know the arts in %%loc%% to convey it to you. Read now.", "A picture is a poem without words for %%aut%%. Read now.", "Art enables us to find ourselves and lose ourselves at the same time in %%loc%%.  Read now.", "Creativity is contagious. %%aut%% passes it on to you. Read now."],
    "Biographies and memoirs": ["Always live your life with your biography in mind. Maybe %%per%% did, hence his lifestyle. Read now.", "Read no history--nothing but biography, for that is life without theory for %%aut%%.", "Just as there is nothing between the admirable omelet and the intolerable, so with autobiography thinks %%aut%%. Read now.", "Biographies should be written by an acute enemy. Do you think this is true for %%per%%. Read now."],
    "Business and investing": ["To create wealth, Warren Buffett thinks you have to read books by %%aut%% 🔥", "There are no secrets to success according to %%aut%%. It is the result of preparation, hard work, and learning from failure. ", "%%aut%% knows there is always space for improvement, no matter how long you've been in the business.", "Sucessful people follow the advice from %%aut%%. You should continue reading his book. Read now."],
    "Children's books": ["Find out what %%per%% and friends are up to today. Read now! 🔥🔥"],
    "Cookbooks, food and wine": ["Every great meal comes from a great recipe. %%aut%% has quite a few of them. Read now! 🔥🔥", "Food is not just eating energy. It's an experience for %%aut%%. Read now.", "The cuisine in %%loc%% is considered as one of the best. Read now.", "%%aut%% wants to teach you interesting things about food. Read now."],
    "History": ["\"%%aut%% is the best historian ever\" - Gandhi", "If you think you have it tough, read history books by %%aut%%.", "The story of %%per%% is too interesting to miss it. Read now.", "History has been shaped by %%per%%. Want to know why? Read now."],
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
    $('#image').empty();
    $('#content').empty();

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
        const book = books.slice(0,1)[0];
        let imageDiv = document.createElement("div");
        imageDiv.style.display = 'flex';
        imageDiv.style.flexDirection = 'column';    
        let image = document.createElement("img");
        image.setAttribute("height", "300");
        image.setAttribute("width", "200");
        image.style.margin = "1%"; 
        image.style.display = "block"; 
        image.style.margin = "auto"; 
        image.src = book.volumeInfo.imageLinks.thumbnail;
        imageDiv.appendChild(image);
        document.getElementById("image").appendChild(imageDiv);

        var xhr = new XMLHttpRequest();
        var url = "http://35.226.214.140:4000";
        var data = JSON.stringify({"bookName": bookName, "author": author});

        let contentDiv = document.createElement("div");
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column'; 
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function (data, status, xhr) {
                var quote = document.createElement("blockquote");
                quote.classList.add("blockquote");
                quote.classList.add("text-center");
                if (data.locationsAndGPE.length === 0) {
                    data.category = "Default"
                }
                if (data.persons.length === 0) {
                    data.category = "Default"
                }
                if (!data.category) {
                    data.category = "Default";
                }
                var sentence = document.createElement("p");
                sentence.classList.add("mb-0");
                sentence.innerHTML += getSentence(data.category, data.author, data.persons[Math.floor(Math.random()*data.persons.length)], data.locationsAndGPE[0]);
                quote.appendChild(sentence);
                var footer = document.createElement("footer");
                footer.classList.add("blockquote-footer");
                footer.innerHTML += data.author;
                quote.appendChild(footer);

                contentDiv.appendChild(quote);

                var metadata = document.createElement("blockquote");
                metadata.classList.add("text-center");

                var gbooks = document.createElement("p");
                gbooks.classList.add("mb-0");
                if ("categories" in book.volumeInfo) {
                    gbooks.innerHTML += "Genre: " + book.volumeInfo.categories[0];
                }
                metadata.appendChild(gbooks);


                var persons = document.createElement("p");
                persons.classList.add("mb-0");
                if ("persons" in data) {
                    persons.innerHTML += "Characters: " + data.persons;
                }
                metadata.appendChild(persons);


                var locs = document.createElement("p");
                locs.classList.add("mb-0");
                if ("locationsAndGPE" in data) {
                    locs.innerHTML += "Locations: " + data.locationsAndGPE;
                }

                metadata.appendChild(locs);
                contentDiv.appendChild(metadata);

                document.getElementById("content").appendChild(contentDiv);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                let data = {
                    authors: book.volumeInfo.authors[0],
                    category: "Default",
                    persons: [book.volumeInfo.authors[0]],
                    locationsAndGPE: ["in the book"]
                }
                var quote = document.createElement("blockquote");
                quote.classList.add("blockquote");
                quote.classList.add("text-center");
                var sentence = document.createElement("p");
                sentence.classList.add("mb-0");
                sentence.innerHTML += getSentence(data.category, data.author, data.persons[Math.floor(Math.random()*data.persons.length)], data.locationsAndGPE[0]);
                quote.appendChild(sentence);

                var footer = document.createElement("footer");
                footer.classList.add("blockquote-footer");
                footer.innerHTML += data.author;
                quote.appendChild(footer);

                contentDiv.appendChild(quote);
                
                document.getElementById("content").appendChild(contentDiv);
            },  
            dataType: "json"
        });
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
