console.log('0')
self.addEventListener('sync', function (event) {
  console.log('1')
  event.waitUntil(async () => {
    console.log('Send to Airtable')
  })
})
