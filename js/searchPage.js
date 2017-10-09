const wikipediaSearchUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&prop=pageprops%7Cpageimages%7Cpageterms&redirects=&ppprop=displaytitle&piprop=thumbnail&pithumbsize=80&pilimit=5&wbptterms=description&gpssearch={query}&gpsnamespace=0&gpslimit=6";
const wikipediaPageUrl = "https://en.wikipedia.org/?curid={id}";

const options = {
 method: 'GET',
 headers: new Headers({'content-type': 'application/json'})
}

function getSearchData(searchQuery) {
  let url = wikipediaSearchUrl.replace('{query}',searchQuery);

  return fetch(url,options).then(function(response) {
    // Convert to JSON
    return  response.json();
  });
}

function redirectToWikipediaPage(event){
  let id = event.target.id;
  let url = wikipediaPageUrl.replace('{id}',id);
  window.open(url,'_blank');
}

function search(){
  var textInputVal = document.getElementById('autocomplete').value;
  if(!textInputVal) {
    if(divElement.classList.contains('show')) {
      divElement.classList.remove("show")
    }
    return;
  }

  var results = getSearchData(textInputVal);

  results.then(data => {

    var divElement = document.getElementById("searchContent");
    while (divElement.hasChildNodes()) {
      divElement.removeChild(divElement.lastChild);
    }

    var pages = data.query.pages;

    var dropDownData = [];

    Object.keys(pages).forEach(function(key,index) {
      var imageUrl = "img/articles.jpg";
      if(pages[key].thumbnail) {
        imageUrl = pages[key].thumbnail.source;
      }

      var description = "No description";
      if(pages[key].terms && pages[key].terms.description && pages[key].terms.description.length > 0) {
        description = pages[key].terms.description[0];
      }

      var dropDownObject = {
        id : key,
        imageUrl : imageUrl,
        title : pages[key].title,
        description : description
      };
      dropDownData.push(dropDownObject);
    });
    console.log(dropDownData);

    for(var i = 0; i < dropDownData.length; i++){
        var div = document.createElement("div");
        div.className = "row dropdown-content-div";
        var x = document.createElement("img");
        x.className = "col-sm-5 dropdown-img";
        x.setAttribute("src", dropDownData[i].imageUrl);
        x.id = dropDownData[i].id;
        div.appendChild(x);
        var spanDiv = document.createElement("div");
        spanDiv.className = "col-sm-7";
        spanDiv.id = dropDownData[i].id;
        var span = document.createElement("span");
        span.id = dropDownData[i].id;
        span.innerHTML = dropDownData[i].title;
        span.className = "row dropdown-header-content";
        spanDiv.appendChild(span);
        var spanDescription = document.createElement("span");
        spanDescription.id = dropDownData[i].id;
        spanDescription.className = "row dropdown-description";
        spanDescription.innerHTML = dropDownData[i].description;
        spanDiv.appendChild(spanDescription);
        div.appendChild(spanDiv);
        div.id = dropDownData[i].id;
        div.onclick = redirectToWikipediaPage;
        divElement.appendChild(div);
    }
    if(!divElement.classList.contains('show')) {
        divElement.classList.toggle("show")
    }

  });
}

window.onclick = function(event) {
  if (!event.target.matches('.input-lg')) {
  var divElement = document.getElementById("searchContent");
  if (divElement.classList.contains('show')) {
      divElement.classList.remove('show');
    }
  }
}
