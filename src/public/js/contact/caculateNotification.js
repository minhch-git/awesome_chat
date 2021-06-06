function decreaseNumberNotification(selector) {
  let currentValue = + $(selector).text()
  currentValue -= 1
  if(currentValue === 0) {
    $(selector).css('display', 'none').html('')
  }else {
    $(selector).css('display', 'block').html(currentValue)
  }
}

function increaseNumberNotification(selector) {
  let currentValue = + $(selector).text()
  currentValue += 1
  if(currentValue === 0) {
    $(selector).css('display', 'none').html('')
  }else {
    $(selector).css('display', 'block').html(currentValue)
  }
}