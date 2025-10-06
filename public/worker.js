console.log("dentro de worker")

self.addEventListener("push",  e =>{
   const data = e.data.json()
   console.log(data)
   console.log("en notificationpush")

   self.registration.showNotification(data.title,
    {
        body: data.message,
        icon:"/static/favicons/android-icon-36x36.png"
    })
})

self.addEventListener("install", function() {
    console.log("install");
  });
  
  self.addEventListener("activate", function() {
    console.log("activate");
  });