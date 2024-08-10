const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dateStart = new Date().toISOString().substring(0,10);
    let dateEnd =  new Date()

    dateEnd.setDate(dateEnd.getDate() + 6);
    dateEnd = dateEnd.toISOString().substring(0,10);

async function getWeather() { 
    try{    
        const city = document.querySelector('#weather-search').value.toLowerCase();
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${dateStart}/${dateEnd}?unitGroup=us&key=JD9P4BWXBDFYUCF527WZE9JZP&contentType=json
`,{mode: 'cors'});

        

        if(!response.ok){
            throw new Error("could not fetch resource");
        }

       const data = await response.json();
       console.log(data);

       domManipulation(data);
   

    } catch(err) {
        console.log(err + "Potential misspelling");
    }

    

}


function domManipulation(jsonData){

    elementMaker("div","card-container", '', document.body);

    elementMaker("div","main-card",'',document.querySelector('.card-container'))

    elementMaker("div","city",`Location: ${jsonData.resolvedAddress}`, document.querySelector(`.main-card`));

    elementMaker("div","card-storage",'', document.querySelector(`.card-container`));

    
    for(let i = 0; i < jsonData.days.length; i++){
        //card per everyday

        if (i === 0){


            const tempDay = new Date(jsonData.days[i].datetime);
            if( (tempDay.getDay() + 1) === 7){
                elementMaker('div','weather-info-item-day',dayNames[0],document.querySelector(`.main-card`));
            }
            else {
                elementMaker('div','weather-info-item-day',dayNames[+((tempDay.getDay()) + 1)],document.querySelector(`.main-card`));
            }
             
        
            elementMaker('div',`misc-stats`,'',document.querySelector('.main-card'));   

        
            elementMaker('div',`misc-item-temp`,`Temperature Feel`,document.querySelector('.misc-stats'));    
            elementMaker('div',`misc-item`,`${jsonData.days[i].feelslike} °F`,document.querySelector('.misc-item-temp'));  


            

            elementMaker('div',`misc-item-humidity`,`Humidity`,document.querySelector('.misc-stats'));  
            elementMaker('div',`misc-item`,`${jsonData.days[i].humidity}%`,document.querySelector('.misc-item-humidity'));  
            




            elementMaker('div',`misc-item-rain`,`Chance of Rain:`,document.querySelector('.misc-stats'));    
            elementMaker('div',`misc-item`,`${jsonData.days[i].precipprob}%`,document.querySelector('.misc-item-rain'));    


            elementMaker('div',`misc-item-winds`,`Wind Speed`,document.querySelector('.misc-stats'));    
            elementMaker('div',`misc-item`,`${jsonData.days[i].windspeed} mph`,document.querySelector('.misc-item-winds'));    


            elementMaker('div','weather-info-item-container',``,document.querySelector(`.main-card`));
            elementMaker('div','weather-info-item-temp',`Current Temperature`,document.querySelector(`.weather-info-item-container`));
            elementMaker('div','weather-info-item',`${jsonData.days[i].temp} °F`,document.querySelector(`.weather-info-item-container`));

            const todayImage = document.createElement('img');
            todayImage.classList.add("today-image");
            todayImage.setAttribute("src", `Images/SVG/1st Set - Monochrome/${jsonData.days[i].icon}.svg`);
            document.querySelector('.weather-info-item-container').appendChild(todayImage);
        }   

        if(i != 0){ 

            elementMaker('div',`card${i}`,'',document.querySelector('.card-storage'));

            document.querySelector(`.card${i}`).classList.add("card");
            // list of items 

            elementMaker('ul','weather-info','',document.querySelector(`.card${i}`));

            // list entries

            const tempDay = new Date(jsonData.days[i].datetime);
           
            
            if((tempDay.getDay() + 1) === 7){
                elementMaker('li','weather-info-item-day',dayNames[0],document.querySelector(`.card${i} > .weather-info`));
            }
            else{
                elementMaker('li','weather-info-item-day',dayNames[+((tempDay.getDay()) + 1)],document.querySelector(`.card${i} > .weather-info`));
            }
            
   

            elementMaker('li','weather-info-item-temp',`Temperature Max:${jsonData.days[i].tempmax} °F`,document.querySelector(`.card${i} > .weather-info`));
            elementMaker('li','weather-info-item-temp',`Temperature Low:${jsonData.days[i].tempmin} °F`,document.querySelector(`.card${i} > .weather-info`));
            const weekImage = document.createElement('img');
            weekImage.classList.add("week-image");
            weekImage.setAttribute("src", `Images/SVG/1st Set - Monochrome/${jsonData.days[i].icon}.svg`);

            document.querySelector(`.card${i} > .weather-info`).appendChild(weekImage);
        }

        
        
    }   
}

function elementMaker(type, classType, content = '', appendTo){
    const elemType = document.createElement(`${type}`);
    elemType.classList.add(`${classType}`);

    if(content != ''){
        elemType.textContent = `${content}`;
    }
    const placeToAppend = appendTo;
    
    
    placeToAppend.appendChild(elemType);
}





document.querySelector("button.confirm-search").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if(document.querySelector('.card-container') != null){
        document.querySelector('.card-container').remove();
    }
    getWeather();
});


