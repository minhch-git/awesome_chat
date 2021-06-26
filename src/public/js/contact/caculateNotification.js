function decreaseNumberNotification(selector, number) {
  let currentValue = + $(selector).text()
  currentValue -= number
  if(currentValue === 0) {
    $(selector).css('display', 'none').html('')
  }else {
    $(selector).css('display', 'block').html(currentValue)
  }
}

function increaseNumberNotification(selector, number) {
  let currentValue = + $(selector).text()
  currentValue += number
  if(currentValue === 0) {
    $(selector).css('display', 'none').html('')
  }else {
    $(selector).css('display', 'block').html(currentValue)
  }
}