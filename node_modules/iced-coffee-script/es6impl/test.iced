
foo = (x, cb) ->

  for i in [0...x]
    console.log "+ wait #{i}"
    await setTimeout defer(), 100
    console.log "- wait #{i}"

  if x % 2 is 0
    console.log "+ if even then wait 2"
    await setTimeout defer(), 2000
    console.log "- done"
  else
    await
      for j in [0...x]
        amt = Math.random()*3
        console.log "+ parallel wait #{amt}"
        setTimeout defer(), amt*1000
    console.log "- done with the wait"
  cb()

foo 6, ->
  console.log "done with the first foo"
  foo 13, ->
    console.log "done with the sescond foo"


