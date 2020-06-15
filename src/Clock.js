// Clock for Task app

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length === 1) {
         month = '0'+month;
    }
    if(day.toString().length === 1) {
         day = '0'+day;
    }   
    if(hour.toString().length === 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length === 1) {
         minute = '0'+minute;
    }
    if(second.toString().length === 1) {
         second = '0'+second;
    }   

    // Structured to with YEAR first then Month Day. better for use as a key and
    // sorting in databases??
    
    //var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;  

    // Structured the way I am more used to: Month Day Year.
    var dateTime = month+'/'+day+'/'+year+' '+hour+':'+minute+':'+second;  

     return dateTime;
}

// example usage: realtime clock
setInterval(function(){

    let currentTime = getDateTime();

    document.getElementById("digital-clock").innerHTML = currentTime;

}, 1000);

///////////////////////////////////////////////////////////////////////