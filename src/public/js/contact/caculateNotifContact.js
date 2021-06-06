function decreaseNumberNotifContact(selector) {
  let currentValue = + $(selector).find('em').text()
  currentValue -= 1
  if(currentValue === 0) {
    $(selector).html('')
  }else {
    $(selector).html(`(<em>${currentValue}</em>)`)
  }
}

function increaseNumberNotifContact(selector) {
  let currentValue = + $(selector).find('em').text()
  currentValue += 1
  console.log(currentValue)
  if(currentValue === 0) {
    $(selector).html(' ')
  }else {
    $(selector).html(`(<em>${currentValue}</em>)`)
  }
}