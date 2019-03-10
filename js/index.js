let apiKey = "AIzaSyBSCTFi6Igi4dmt7KPmMKrEsFmGRQFHe-8";
//AIzaSyA2heq-x_zY1kV745OmJVkQejDh4GMCi3E

let searchTerm;

function buildFetch(searchTerm, urlSearch, callback){
  $.ajax({
    url : urlSearch,
    method : "GET",
    data: {
        apiKey: apiKey,
        q: searchTerm,
    },
    dataType : "json",
    success : responseJson => callback(responseJson),
    error : err => console.log(err)
  });
}

function watchForm(){
  $(".videosForm").on("submit", (event) => {
    event.preventDefault();

    searchTerm = $('#videoSearchBox').val();
    if(searchTerm != "")
    {
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchTerm}&key=${apiKey}`;
      buildFetch(searchTerm, url, displayVideos);
    }
  });
}


function displayVideos(data){
  	$(".results").html(""); //Empty the html of that section
    $(".navButtons").html("");

  	for(let i = 0; i < data.items.length; i++)
    {
    	$(".results").append(`
    						<div class="videoElement">
    							<div class = "videoTitle">
                    <a href = "https://www.youtube.com/watch?v=${data.items[i].id.videoId}"" target = "-blank">
      								<h3>${data.items[i].snippet.title}</h3>
                    </a>
    							</div>
    							<a href = "https://www.youtube.com/watch?v=${data.items[i].id.videoId}"" target = "-blank">
    								<img style="width:15%" src="${data.items[i].snippet.thumbnails.default.url}" alt="${searchTerm} Image" />
    							</a>
    						</div>`);
    }

    addButtons(data);  
}

function addButtons(data){
  console.log("Add buttons called");
  if(data.nextPageToken)
  {
    let newNextButton=$(`
                      <button type="submit" id="nextVideos" class="buttons">
                        Next videos
                      </button>
                    `);
    

    $(newNextButton).on("click", function(event){
      if(searchTerm != "")
      {
        let url = `https://www.googleapis.com/youtube/v3/search?pageToken=${data.nextPageToken}&part=snippet&maxResults=10&q=${searchTerm}&key=${apiKey}`;
        buildFetch(searchTerm, url, displayVideos);
        console.log("Fetch for next videos");
      }
    });

    $(".navButtons").append(newNextButton);
  }

  if(data.prevPageToken)
  {
    let newPrevButton=$(`
                      <button type="submit" id="prevVideos" class="buttons">
                        Previous videos
                      </button>
                    `);
    

    $(newPrevButton).on("click", function(event){
      if(searchTerm != "")
      {
        let url = `https://www.googleapis.com/youtube/v3/search?pageToken=${data.prevPageToken}&part=snippet&maxResults=10&q=${searchTerm}&key=${apiKey}`;
        buildFetch(searchTerm, url, displayVideos);
        console.log("Fetch for next videos");
      }
    });

    $(".navButtons").append(newPrevButton);
  }
}

//This how jquery executes a function
$(watchForm);