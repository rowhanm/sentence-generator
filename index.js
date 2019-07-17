function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getSentence(category, author, person, location) {
    console.log("inside get sentence");
    console.log(category, author, person, location);
    if(category === "Arts and photography") {
        sentences = [`Great artists like ${author} think reading is the first step to creating great art. Read!`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Biographies and memoirs") {
        sentences = [`${person} was one of the greats. Read more about him now!`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Business and investing") {
        sentences = [`To create wealth, Warren Buffett thinks you have to read books by ${author}`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Children's books") {
        sentences = [`Find out what ${person} and friends are up to today. Read now!`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Cookbooks, food and wine") {
        sentences = [`Every great meal comes from a great recipe. ${author} has quite a few of them. Read now!`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "History") {
        sentences = [`"${author} is the best historian ever" - Gandhi`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Literature and Fiction") {
        sentences = [`${person} wants you to read now!`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Mystery and suspense") {
        sentences = [`"I'm so scared! Please read to save me!" - ${person}`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Romance") {
        sentences = [`Man, isnt love a strange thing. ${person} definitely thinks so!`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Sci-Fi and Fantasy") {
        sentences = [`${location} is one of the most interesting places in pop culture. Read more to see whats happening there!`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
    if(category === "Teens and young adults") {
        sentences = [`Check out what ${person} is upto in ${location}`]
        return sentences[Math.floor(Math.random()*sentences.length)]; 
    }
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
    console.log('https://www.googleapis.com/books/v1/volumes?q=' + bookName + "+" + author + '&orderBy=relevance&langRestrict=en')
    client.get('https://www.googleapis.com/books/v1/volumes?q=' + bookName + "+" + author + '&orderBy=relevance&langRestrict=en', function(response) {
        let books = JSON.parse(response).items;
        console.log(books);
        books = books.slice(0,1);
        books.forEach(element => {
            console.log(element.volumeInfo);
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
                    title.innerHTML += "Title: " + data.title;
                    gbooks.innerHTML += "GBooks category: " + element.volumeInfo.categories[0];
                    category.innerHTML += "Category: " + data.category;
                    author.innerHTML += "Author: " + data.author;
                    persons.innerHTML += "Persons: " + data.persons;
                    locs.innerHTML += "Locations: " + data.locationsAndGPE;
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
                    sen1.innerHTML += getSentence(data.category, data.author, data.persons[Math.floor(Math.random()*data.persons.length)], data.locationsAndGPE[0]);
                    notifications.appendChild(sen1);
                    notifications.style.borderStyle = "ridge";
                    newDiv.appendChild(notifications);
                },
                dataType: "json"
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
